// src/data/blogs/blog.ts
import React, { JSX } from "react";

export type Blog = {
  slug: string;
  title: string;
  date: string;
  views: number;
  image: string;
  content: JSX.Element;
};
