"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Banana, Cherry, Leaf } from "lucide-react";
import Image from "next/image";

const fruits = [
  { name: "Mystic Apple", icon: <Apple className="w-10 h-10 text-red-500" />, image: "https://placehold.co/100x100.png", hint: "apple fruit" },
  { name: "Golden Banana", icon: <Banana className="w-10 h-10 text-yellow-500" />, image: "https://placehold.co/100x100.png", hint: "banana bunch" },
  { name: "Ruby Cherry", icon: <Cherry className="w-10 h-10 text-pink-600" />, image: "https://placehold.co/100x100.png", hint: "cherries red" },
  { name: "Verdant Pear", icon: <Leaf className="w-10 h-10 text-green-500" />, image: "https://placehold.co/100x100.png", hint: "pear green" },
];

export function FruitsCatalog() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Fruits Catalog</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {fruits.map((fruit) => (
            <div key={fruit.name} className="flex flex-col items-center p-3 border rounded-lg hover:shadow-md transition-shadow bg-card">
              <Image 
                src={fruit.image} 
                alt={fruit.name} 
                width={60} 
                height={60} 
                className="rounded-md mb-2 object-cover"
                data-ai-hint={fruit.hint}
              />
              <div className="text-center text-sm font-medium">{fruit.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
