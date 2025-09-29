'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface DistributionData {
  count: number;
  percentage: number;
}

interface DistributionChartProps {
  title: string;
  data: Record<string | number, DistributionData>;
  type: 'pie' | 'bar';
  className?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  data,
  type,
  className
}) => {
  const entries = Object.entries(data);
  const maxCount = Math.max(...entries.map(([, d]) => d.count));

  // Color palette for visualization
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  if (entries.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'pie' ? (
          <div className="space-y-3">
            {/* Simple pie representation using bars */}
            <div className="space-y-2">
              {entries.map(([key, value], index) => {
                const colorClass = colors[index % colors.length];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                    <div className="flex-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{value.count}</span>
                        <span className="text-gray-500 text-xs">({value.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual pie representation using stacked progress */}
            <div className="relative">
              <div className="flex rounded-full overflow-hidden h-4 bg-gray-200">
                {entries.map(([key, value], index) => {
                  const colorClass = colors[index % colors.length];
                  return (
                    <div
                      key={key}
                      className={colorClass}
                      style={{ width: `${value.percentage}%` }}
                      title={`${key}: ${value.percentage}%`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Bar chart representation */}
            <div className="space-y-3">
              {entries.map(([key, value], index) => {
                const colorClass = colors[index % colors.length];
                const barWidth = maxCount > 0 ? (value.count / maxCount) * 100 : 0;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{value.count}</span>
                        <span className="text-gray-500 text-xs">({value.percentage}%)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colorClass}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DistributionChart;