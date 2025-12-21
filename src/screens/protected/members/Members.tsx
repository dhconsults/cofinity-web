// src/pages/Members.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Eye, Users, Landmark, PiggyBank, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import type { Member } from "@/types";
import MemberSkeleton from "@/screens/Components/MemberSkeleton";
import { MEMBERS_API } from "@/constants";
import { useNavigate } from "react-router-dom";



export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
  

  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.LIST);
      return res.data; // { members: [...], quota: {. ..}, can_add_member: true }
    },
  });

 
  const members: Member[] = data?.members?.data || [];
  const pagination = data?.members;
  const quota = data?.quota;
  const canAddMember = data?.can_add_member ?? true;

  const filteredMembers = members.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.membership_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  const getMemberTypeBadge = (type?: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      vip: { label: "VIP", variant: "default" },
      premium: { label: "Premium", variant: "secondary" },
      founder: { label: "Founder", variant: "outline" },
      regular: { label: "Regular", variant: "outline" },
    };
    const config = map[type || "regular"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) return <MemberSkeleton />;
  if (error) return <div className="text-center text-red-600 p-8">Failed to load members</div>;

  const handleadd = () => { 

    navigate('/add-member')
  }

  const handleviewmember = (id:number) => { 
    navigate(`/members/${id}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6 lg:p-8">
      <div className=" mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Members</h1>
            <p className="text-neutral-600 mt-1">Manage your cooperative members</p>
          </div>
          <Button
            disabled={!canAddMember}
            className="bg-black hover:bg-neutral-900"
            onClick={() => handleadd()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
            {!canAddMember && " (Quota Full)"}
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Members</p>
                <p className="text-3xl font-bold">{members.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Verified KYC</p>
                <p className="text-3xl font-bold">
                  {members.filter(m => m.bvn_verified || m.nin_verified).length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </Card>
         
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Quota Used</p>
                <p className="text-3xl font-bold">
                  {quota?.used} / {quota?.limit === "Unlimited" ? "∞" : quota?.limit}
                </p>
              </div>
              <Landmark className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="border-nuetral-50">
          {filteredMembers.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No members found</h3>
              <p className="text-neutral-600">Try adjusting your search</p>
            </div>
          ) : (
            <Table  >
              <TableHeader>
                <TableRow>
                  <TableHead> S/N  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>KYC</TableHead>
                   <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, i) => (
                  <TableRow key={member.id}>
                    <TableCell >{ i + 1 }</TableCell>
                    <TableCell className="font-medium">
                      {member.first_name} {member.last_name}
                    </TableCell>
                    <TableCell>{member.membership_id}</TableCell>
                    <TableCell>
                      {getMemberTypeBadge(member.meta?.member_type)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.bvn_verified || member.nin_verified ? "default" : "secondary"}>
                        {member.bvn_verified || member.nin_verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
              
                    <TableCell>
                      {format(new Date(member.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="primary" size="sm" onClick={()=> handleviewmember(member.id) }>
                        View <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}