"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/auth/session-provider";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
  description: string;
}

export function RecentlyViewed() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/courses/recently-viewed");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Failed to fetch recently viewed:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchRecentlyViewed();
    }
  }, [user]);

  if (!user || courses.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                 <Image
                    src={course.thumbnail || "/placeholder-course.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
              </div>
              <CardHeader className="p-4 pb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {course.description.replace(/<[^>]*>?/gm, "")}
                </p>
                <div className="font-bold text-primary">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/courses/${course._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Again
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
