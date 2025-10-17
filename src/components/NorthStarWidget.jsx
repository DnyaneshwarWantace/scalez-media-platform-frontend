import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Target, 
  Eye, 
  EyeOff,
  ChevronRight,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getActiveNorthStarMetrics } from "../redux/slices/northStarMetricSlice";

function NorthStarWidget() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMetrics: northStarMetrics, loading } = useSelector(state => state.northStarMetric);

  // Load active North Star Metrics
  useEffect(() => {
    dispatch(getActiveNorthStarMetrics());
  }, [dispatch]);

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <Target className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4" />
            <h3 className="text-sm font-medium">North Star Metrics</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <h3 className="text-sm font-medium">North Star Metrics</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/north-star')}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {northStarMetrics.filter(metric => metric.isPublic).length === 0 ? (
            <div className="text-center py-4">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No public metrics yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/north-star')}
                className="mt-2"
              >
                Add Metrics
              </Button>
            </div>
          ) : (
            northStarMetrics.filter(metric => metric.isPublic).slice(0, 3).map((metric) => (
              <div key={metric._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{metric.name}</p>
                    <Eye className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                      {metric.trendPercentage > 0 ? '+' : ''}{metric.trendPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{metric.currentValue.toLocaleString()} {metric.unit}</span>
                    <span>{metric.targetValue.toLocaleString()} {metric.unit}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-black h-1.5 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(metric.currentValue, metric.targetValue)}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    {Math.round(getProgressPercentage(metric.currentValue, metric.targetValue))}% of target
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {northStarMetrics.filter(metric => metric.isPublic).length > 3 && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/north-star')}
              className="w-full text-xs"
            >
              View All Metrics ({northStarMetrics.filter(metric => metric.isPublic).length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NorthStarWidget;
