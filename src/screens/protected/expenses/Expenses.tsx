"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  FolderOpen,
  Receipt,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { EXPENSE_API } from "@/constants";
import { toast } from "sonner";
// Types
interface ExpenseCategory {
  id: number;
  name: string;
  description: string | null;
  color: string;
  total_expenses: number;
  expenses_count: number;
}

interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  payment_method: string;
  receipt_number: string | null;
  approved_by: string | null;
  status: "pending" | "approved" | "rejected";
  category: {
    id: number;
    name: string;
    color: string;
  };
}

interface ExpenseSummary {
  total_expenses: number;
  approved_expenses: number;
  pending_expenses: number;
  categories_count: number;
}

 const fetchCategories = async (): Promise<ExpenseCategory[]> => {
  const response = await apiClient.get(EXPENSE_API.CATEGORIES);
  return response.data;
};
const fetchExpenses = async (params: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<{ data: Expense[]; meta: any }> => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.status && params.status !== "all") searchParams.append("status", params.status);
  const response = await apiClient.get(`${EXPENSE_API.EXPENSES}?${searchParams}`);
  return response;
};
const fetchSummary = async (): Promise<ExpenseSummary> => {
  const response = await apiClient.get(EXPENSE_API.SUMMARY);
  return response.data;
};

// New: Export function (triggers download)
const exportExpenses = async () => {
  const response = await apiClient.get(`${EXPENSE_API.EXPENSES}/export`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "expenses_export.csv"); // Adjust filename/extension if needed
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const createCategory = async (data: {
  name: string;
  description: string;
  color: string;
}) => {
  const response = await apiClient.post(EXPENSE_API.CATEGORIES, data);
  return response.data;
};

// New: Update category
const updateCategory = async (id: number, data: {
  name: string;
  description: string;
  color: string;
}) => {
  const response = await apiClient.patch(`${EXPENSE_API.CATEGORIES}/${id}`, data);
  return response.data;
};

const createExpense = async (data: any) => {
  const response = await apiClient.post(EXPENSE_API.EXPENSES, data);
  return response.data;
};
const deleteExpense = async (id: number) => {
  await apiClient.delete(`${EXPENSE_API.EXPENSES}/${id}`);
};
const deleteCategory = async (id: number) => {
  await apiClient.delete(`${EXPENSE_API.CATEGORIES}/${id}`);
};

// Utility functions (unchanged)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    approved: { label: "Approved", className: "bg-green-100 text-green-800 border-green-200" },
    pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
  };
  const cfg = config[status as keyof typeof config] || config.pending;
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
};

export default function ExpensesManagementPage() {
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isViewCategoriesOpen, setIsViewCategoriesOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    color: "blue",
  });
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    expense_category_id: "",
    description: "",
    amount: "",
    payment_method: "Cash",
    receipt_number: "",
    approved_by: "",
    status: "pending" as "pending" | "approved" | "rejected",
  });

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: fetchCategories,
  });
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", searchQuery, statusFilter],
    queryFn: () => fetchExpenses({ search: searchQuery, status: statusFilter }),
  });
  const { data: summary } = useQuery({
    queryKey: ["expense-summary"],
    queryFn: fetchSummary,
  });

  const expenses: Expense[] = expensesData?.data || [];

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      setIsAddCategoryOpen(false);
      setCategoryForm({ name: "", description: "", color: "blue" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: number; payload: any }) => updateCategory(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      setIsEditCategoryOpen(false);
      setSelectedCategory(null);
    },
  });

  const exportMutation = useMutation({
    mutationFn: exportExpenses,
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-summary"] });
      setIsAddExpenseOpen(false);
      setExpenseForm({
        date: new Date().toISOString().split("T")[0],
        expense_category_id: "",
        description: "",
        amount: "",
        payment_method: "Cash",
        receipt_number: "",
        approved_by: "",
        status: "pending",
      });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["expenses"] }); 
        toast.success('Deleted successfully'); 
      },

      onError: (error:any) => { 

        
        toast.error(error?.message || "Failed to delete"); 

        
      }

     


  });

 

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res:any) => {
       
       queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
       toast.success('Expenses Category Updated', {description: res.message }) 


    }, 
     onError: (error: any) => {
      toast.error(error?.message || "Failed to delete");
   },
});  

  // Handlers
  const handleCategorySave = () => {
    if (!categoryForm.name.trim()) return toast.error("Category name is required");
    createCategoryMutation.mutate(categoryForm);
  };

  const handleCategoryUpdate = () => {
    if (!selectedCategory || !categoryForm.name.trim()) return toast.error("Category name is required");
    updateCategoryMutation.mutate({ id: selectedCategory.id, payload: categoryForm });
  };

  const openEditCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
    setIsEditCategoryOpen(true);
  };

  const handleExpenseSave = () => {
    if (
      !expenseForm.expense_category_id ||
      !expenseForm.description.trim() ||
      !expenseForm.amount ||
      parseFloat(expenseForm.amount) <= 0
    ) {
      return toast.error("Please fill all required fields correctly");
    }
    createExpenseMutation.mutate({
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      expense_category_id: parseInt(expenseForm.expense_category_id),
    });
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpenseMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category? This will not delete existing expenses.")) {
      deleteCategoryMutation.mutate(id);
    }
  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all cooperative expenses and categories
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>

          {/* View Categories */}



          <Dialog open={isViewCategoriesOpen} onOpenChange={setIsViewCategoriesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                View Categories
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Expense Categories</DialogTitle>
                <DialogDescription>Manage your expense categories and view statistics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {categoriesLoading ? (
                  <p>Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p>No categories yet.</p>
                ) : (
                  categories.map((category) => (
                    <Card key={category.id} className={`border-l-4 border-l-${category.color}-500`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description || "No description"}
                            </p>
                            <div className="flex gap-4 mt-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Total Expenses:</span>
                                <span className="font-semibold ml-2">
                                  {formatCurrency(category.total_expenses)}
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Count:</span>
                                <span className="font-semibold ml-2">{category.expenses_count}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openEditCategory(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>




       



          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Expense Category</DialogTitle>
                <DialogDescription>Update category details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="editCategoryName">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editCategoryName"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCategoryDescription">Description</Label>
                  <Textarea
                    id="editCategoryDescription"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCategoryColor">Category Color</Label>
                  <Select
                    value={categoryForm.color}
                    onValueChange={(value) => setCategoryForm((prev) => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCategoryUpdate}
                    className="bg-black hover:bg-gray-800"
                    disabled={updateCategoryMutation.isPending}
                  >
                    {updateCategoryMutation.isPending ? "Saving..." : "Update Category"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>




          {/* Add Category */}
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your expenses
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Office Supplies"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    placeholder="Brief description..."
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryColor">Category Color</Label>
                  <Select
                    value={categoryForm.color}
                    onValueChange={(value) =>
                      setCategoryForm((prev) => ({ ...prev, color: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddCategoryOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCategorySave}
                    className="bg-black hover:bg-gray-800"
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending ? "Saving..." : "Save Category"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Expense */}
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense transaction.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseDate">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expenseDate"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenseCategory">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={expenseForm.expense_category_id}
                      onValueChange={(value) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          expense_category_id: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenseAmount">
                      Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expenseAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={expenseForm.payment_method}
                      onValueChange={(value) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          payment_method: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input
                      id="receiptNumber"
                      placeholder="RCP-2025-XXX"
                      value={expenseForm.receipt_number}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          receipt_number: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvedBy">Approved By</Label>
                    <Input
                      id="approvedBy"
                      placeholder="Name of approver"
                      value={expenseForm.approved_by}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          approved_by: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="expenseStatus">Status</Label>
                    <Select
                      value={expenseForm.status}
                      onValueChange={(value: any) =>
                        setExpenseForm((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseDescription">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="expenseDescription"
                    placeholder="Enter expense details..."
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddExpenseOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExpenseSave}
                    className="bg-black hover:bg-gray-800"
                    disabled={createExpenseMutation.isPending}
                  >
                    {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-black">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Total Expenses
            </CardDescription>
            <CardTitle className="text-2xl">
              {summary ? formatCurrency(summary.total_expenses) : "₦0"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">All time expenses</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Approved
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {summary ? formatCurrency(summary.approved_expenses) : "₦0"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Approved expenses</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Receipt className="w-4 h-4" />
              Pending
            </CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {summary ? formatCurrency(summary.pending_expenses) : "₦0"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <FolderOpen className="w-4 h-4" />
              Categories
            </CardDescription>
            <CardTitle className="text-2xl text-purple-600">
              {summary?.categories_count ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <CardTitle>All Expenses</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-right">Amount</TableHead>
                  <TableHead className="font-semibold">Payment Method</TableHead>
                  <TableHead className="font-semibold">Receipt #</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expensesLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading expenses...
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(expense.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {expense.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{expense.description}</p>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>{expense.payment_method}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {expense.receipt_number || "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={expense.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedExpense(expense)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {expenses.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {expenses.length} expense(s)
            </div>
          )}
        </CardContent>
      </Card>




      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>Full details of the selected expense</DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Date</Label>
                  <p className="font-medium">{formatDate(selectedExpense.date)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Category</Label>
                  <p className="font-medium">{selectedExpense.category.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Amount</Label>
                  <p className="font-medium">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Payment Method</Label>
                  <p className="font-medium">{selectedExpense.payment_method}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Receipt Number</Label>
                  <p className="font-medium">{selectedExpense.receipt_number || "—"}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Approved By</Label>
                  <p className="font-medium">{selectedExpense.approved_by || "—"}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <StatusBadge status={selectedExpense.status} />
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="font-medium mt-1">{selectedExpense.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>



    </div>
  );
}