"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.leads);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* <AdminSidebar /> - If you have a sidebar layout, wrap this properly */}
      <div className="container mx-auto p-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Lead Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Captured Leads (Anonymous Users)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-muted-foreground">No leads captured yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Interested In</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Phone size={14} className="text-muted-foreground"/>
                           {lead.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                          {lead.courseId ? (
                              <Link href={`/courses/${lead.courseId}`} className="text-blue-500 hover:underline flex items-center gap-1">
                                  View Course <ExternalLink size={12}/>
                              </Link>
                          ) : "General Inquiry"}
                      </TableCell>
                      <TableCell>{new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge variant={lead.status === "new" ? "destructive" : "secondary"}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
