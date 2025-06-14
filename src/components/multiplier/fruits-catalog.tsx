
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Carrot, Leaf, Grape, Flower2, Sprout, Bean } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const fruits = [
  { name: "Carrot", icon: <Carrot className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "carrot vegetable" },
  { name: "Strawberry", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "strawberry fruit" },
  { name: "Blueberry", icon: <Grape className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "blueberry fruit" },
  { name: "Orange Tulip", icon: <Flower2 className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "tulip flower" },
  { name: "Tomato", icon: <Apple className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "tomato red" },
  { name: "Corn", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "corn cob" },
  { name: "Daffodil", icon: <Flower2 className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "daffodil flower" },
  { name: "Watermelon", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "watermelon slice" },
  { name: "Pumpkin", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "pumpkin orange" },
  { name: "Apple", icon: <Apple className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "apple fruit" },
  { name: "Bamboo", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "bamboo plant" },
  { name: "Coconut", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "coconut brown" },
  { name: "Cactus", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "cactus green" },
  { name: "Dragon Fruit", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "dragonfruit pink" },
  { name: "Mango", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "mango fruit" },
  { name: "Grape", icon: <Grape className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "grape bunch" },
  { name: "Pepper", icon: <Leaf className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "pepper red" },
  { name: "Cacao", icon: <Bean className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "cacao bean" },
  { name: "Beanstalk", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "beanstalk green"},
  { name: "Ember Lily", icon: <Flower2 className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "lily flower" },
  { name: "Mushroom", icon: <Sprout className="w-10 h-10 text-primary" />, image: "https://placehold.co/100x100.png", hint: "mushroom fungi" }
];

export function FruitsCatalog() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Fruits Catalog</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
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
                 <div className="text-center text-sm font-medium flex items-center justify-center space-x-1">
                  {React.cloneElement(fruit.icon, { className: "w-5 h-5 text-primary" })}
                  <span>{fruit.name}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
