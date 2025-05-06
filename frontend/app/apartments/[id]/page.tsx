import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ApartmentDetailsClient from "@/components/apartments/ApartmentDetails";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ApartmentDetailsPage({ params }: { params:Promise<{ id: string }>}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apartments/${id}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const { data: apartment } = await res.json();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Back Arrow */}
      <div className="mb-6">
        <Link href="/apartments" className="inline-flex items-center gap-2 text-gray-700 hover:text-black group">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <span className="text-base font-medium">Back to Listings</span>
        </Link>
      </div>
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl font-bold mb-2">{apartment.unitName}</CardTitle>
          <div className="text-gray-500 text-sm font-mono">Unit #{apartment.unitNumber} &mdash; {apartment.project}</div>
        </CardHeader>
        <CardContent>
          <ApartmentDetailsClient apartment={apartment} />
        </CardContent>
      </Card>
    </div>
  );
}