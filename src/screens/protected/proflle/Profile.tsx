// src/app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Camera, Check, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { apiClient } from '@/lib/api-client'; 
import { formatPhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
   first_name: z.string().min(2, "First Name must be at least 2 character"),
  last_name: z.string().min(2, "Last Name must be at least 2 character"),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  current_password: z.string().optional(),
  new_password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  confirm_password: z.string().optional(),
}).refine((data) => {
  if (data.new_password && !data.current_password) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['current_password'],
}).refine((data) => {
  if (data.new_password && data.new_password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',  
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const newPassword = watch('new_password');

  // Fetch current user (in case of refresh)
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => apiClient.get('/user').then(res => res.data),
    initialData: user,
  });

  // Update profile mutation
 

  const updateProfileMutation = useMutation({
  mutationFn: (data: ProfileFormData) => {
    const payload: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
    };

    if (data.new_password) {
      return apiClient.post('/api/tenant-users/password', {
        current_password: data.current_password,
        password: data.new_password,
        password_confirmation: data.confirm_password,
      }).then(() => {
        // After password success, update profile info
        return apiClient.put('/api/tenant-users/profile', payload);
      });
    }

    return apiClient.put('/api/tenant-users/profile', payload);
  },
  onSuccess: (response) => {
    const updatedUser = response?.data?.data || currentUser;
    updateUser({
      ...currentUser,
      ...updatedUser,
      full_name: `${updatedUser.first_name} ${updatedUser.last_name}`,
    });
    toast.success('Profile Updated', { description: 'Your changes have been saved.' });
    reset({
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
  },
 onError: (err:any) => { 
    toast.error('Profile Update Failed', { description: err?.message })
 }
});




  // Upload avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await apiClient.post('/api/tenant-users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = res.data.data;
      updateUser(updatedUser);
      toast.success('Avatar Updated', { description: 'Your profile picture has been updated.' });
    } catch (err: any) {
      toast.error('Upload Failed', {
        description: err?.message || 'Please try again', 
      });
      setPreviewUrl(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
  console.log('Form submitted with data:', data); // Add this
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

const avatarUrl = previewUrl || currentUser?.profile_photo || null;


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and security settings</p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your avatar</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </span>
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



              <div className="space-y-2">
                <Label htmlFor="first_name">First Name </Label>
                <Input id="first_name" {...register('first_name')} />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register('last_name')} />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
              </div>
           







              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="08012345678"
                  {...register('phone')}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setValue('phone', formatted);
                  }}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentUser?.role?.toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">Cannot be changed</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input id="current_password" type="password" {...register('current_password')} />
                  {errors.current_password && (
                    <p className="text-sm text-destructive">{errors.current_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" type="password" {...register('new_password')} />
                  {errors.new_password && (
                    <p className="text-sm text-destructive">{errors.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input id="confirm_password" type="password" {...register('confirm_password')} />
                  {errors.confirm_password && (
                    <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>

              {newPassword && (
                <Alert className="mt-4">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Leave blank to keep current password
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || updateProfileMutation.isPending}>
                {isSubmitting || updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}