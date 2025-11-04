// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { Card, CardContent } from "@/bilesenler/arayuz/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Aradığın Sayfayı mı bulamadın Berat?</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Sayfayı yönlendiriciye eklemeyi mi unuttum???
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
