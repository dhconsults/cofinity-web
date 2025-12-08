// src/components/member/MemberDetails.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInYears } from "date-fns";
import {
  User, Calendar, Shield, Building2, Phone, Mail,
  MapPin, UserCheck, FileCheck, Home, CalendarCheck
} from "lucide-react";
import type { Member } from "@/types";
 

interface MemberDetailsProps {
  member: Member
}
 

export default function MemberDetails(  {member} : MemberDetailsProps) {

  const fullName = [member.first_name, member.other_name, member.last_name]
    .filter(Boolean)
    .join(" ");

  const age = member.date_of_birth
    ? differenceInYears(new Date(), new Date(member.date_of_birth))
    : 2;

  const kycDocuments = [
    { label: "Passport Photo", field: "passport_photo", icon: UserCheck },
    { label: "ID Front", field: "id_front", icon: FileCheck },
    { label: "ID Back", field: "id_back", icon: FileCheck },
    { label: "Proof of Address", field: "proof_of_address", icon: Home },
    { label: "Signature", field: "signature", icon: FileCheck },
  ];

  const uploadedCount = kycDocuments.filter(doc => !!member[doc.field as keyof typeof member]).length;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <User className="w-7 h-7 text-neutral-700" />
        Personal Information
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-neutral-200 rounded-full border-2 border-dashed" />
              
              <div className="flex-1">
                <p className="text-sm text-neutral-600">Full Name</p>
                <p className="text-xl font-bold text-neutral-900">{fullName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-neutral-600">Gender: <span className="font-medium capitalize">{member.gender}</span></span>
                  <span className="text-neutral-600">Age: <span className="font-medium">{age} years</span></span> 
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-600">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(member.date_of_birth), "dd MMMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-600">Date Joined</p>
                  <p className="font-medium">
                    {format(new Date(member.date_joined), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-600">Branch</p>
                  <p className="font-medium">{member.branch?.name || "Not assigned"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-600">Location</p>
                  <p className="font-medium">{member.lga}, {member.city}, {member.state}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact & KYC Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-600">Phone</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
              </div>
              {member.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-medium text-sm">{member.email}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              KYC Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Identity Verification</span>
                <Badge variant={(member.bvn_verified || member.nin_verified) ? "default" : "secondary"}>
                  {member.bvn_verified || member.nin_verified ? "Verified" : "Pending"}
                </Badge>
              </div>
              {member.bvn_verified && (
                <Badge variant="outline" className="w-full justify-center">BVN Verified</Badge>
              )}
              {member.nin_verified && (
                <Badge variant="outline" className="w-full justify-center">NIN Verified</Badge>
              )}
              <div className="pt-3 border-t">
                <p className="text-sm text-neutral-600">Documents Uploaded</p>
                <p className="text-2xl font-bold text-neutral-900">{uploadedCount}/5</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Address */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Full Address
        </h3>
        <p className="text-neutral-700 leading-relaxed">
          {member.address},<br />
          {member.lga}, {member.city}, {member.state}
        </p>
      </Card>
    </div>
  );
}