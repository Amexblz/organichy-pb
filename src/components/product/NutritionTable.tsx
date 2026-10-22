import React from "react";

export interface NutritionFacts {
  energyKcal?: number;
  proteinG?: number;
  carbsG?: number;
  dietaryFiberG?: number;
  addedSugarG?: number;
  totalFatG?: number;
  saturatedFatG?: number;
  transFatG?: number;
  cholesterolMg?: number;
  sodiumMg?: number;
}

export default function NutritionTable({ nutritionJson }: { nutritionJson?: string | null }) {
  let facts: NutritionFacts = {
    energyKcal: 598,
    proteinG: 32.0,
    carbsG: 18.5,
    dietaryFiberG: 7.8,
    addedSugarG: 4.2,
    totalFatG: 46.0,
    saturatedFatG: 8.5,
    transFatG: 0.0,
    cholesterolMg: 0.0,
    sodiumMg: 140,
  };

  if (nutritionJson) {
    try {
      facts = typeof nutritionJson === "string" ? JSON.parse(nutritionJson) : nutritionJson;
    } catch (e) {
      // keep fallback
    }
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3 mb-3">
        <div>
          <h4 className="font-black text-lg sm:text-xl text-stone-950 uppercase tracking-tight">
            NUTRITION FACTS
          </h4>
          <p className="text-xs text-stone-500 font-semibold">Values per 100g Serving Size</p>
        </div>
        <div className="text-right">
          <span className="bg-stone-900 text-amber-400 font-black text-xs px-2.5 py-1 rounded-md">
            LAB TESTED
          </span>
        </div>
      </div>

      {/* Protein Highlight Box */}
      <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
            HIGH BIOLOGICAL VALUE PROTEIN
          </span>
          <p className="text-xs text-amber-800 font-medium">Fuels lean muscle repair & sustained stamina</p>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-stone-950">
          {facts.proteinG || 32}g
        </span>
      </div>

      {/* Grid of detailed nutrients */}
      <div className="divide-y divide-stone-200 text-xs sm:text-sm">
        <div className="flex justify-between py-2 font-bold text-stone-900">
          <span>Energy (Calories)</span>
          <span>{facts.energyKcal || 598} kcal</span>
        </div>
        <div className="flex justify-between py-2 text-stone-700">
          <span className="font-semibold">Protein</span>
          <span className="font-bold text-stone-900">{facts.proteinG || 32}g</span>
        </div>
        <div className="flex justify-between py-2 text-stone-700">
          <span>Total Carbohydrates</span>
          <span>{facts.carbsG || 18.5}g</span>
        </div>
        <div className="flex justify-between py-2 pl-4 text-stone-500 text-xs">
          <span>Dietary Fiber</span>
          <span>{facts.dietaryFiberG || 7.8}g</span>
        </div>
        <div className="flex justify-between py-2 pl-4 text-stone-500 text-xs">
          <span>Added Sugar</span>
          <span>{facts.addedSugarG !== undefined ? `${facts.addedSugarG}g` : "0g"}</span>
        </div>
        <div className="flex justify-between py-2 text-stone-700">
          <span>Total Healthy Fats</span>
          <span>{facts.totalFatG || 46}g</span>
        </div>
        <div className="flex justify-between py-2 pl-4 text-stone-500 text-xs">
          <span>Saturated Fatty Acids</span>
          <span>{facts.saturatedFatG || 8.5}g</span>
        </div>
        <div className="flex justify-between py-2 pl-4 text-stone-500 text-xs">
          <span>Trans Fatty Acids</span>
          <span className="font-bold text-green-700">0.0g (0%)</span>
        </div>
        <div className="flex justify-between py-2 pl-4 text-stone-500 text-xs">
          <span>Cholesterol</span>
          <span className="font-bold text-green-700">0.0 mg</span>
        </div>
        <div className="flex justify-between py-2 text-stone-700">
          <span>Sodium</span>
          <span>{facts.sodiumMg || 140} mg</span>
        </div>
      </div>
    </div>
  );
}
