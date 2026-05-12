"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function ExerciseChart({ data, name }: { data: any[], name: string }) {
  if (data.length === 0) return <div className="text-slate-500 text-center py-10">Δεν υπάρχουν αρκετά δεδομένα για γράφημα.</div>;

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-sm text-slate-500">Πρόοδος Εκτιμώμενου 1RM (kg)</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="oneRM" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRM)"
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}