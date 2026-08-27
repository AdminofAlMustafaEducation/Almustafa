import campusExterior from "@/assets/gallery/campus-exterior.jpg";
import teacherBoard from "@/assets/gallery/teacher-board.jpg";
import notebook from "@/assets/gallery/notebook.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import library from "@/assets/gallery/library.jpg";
import lab from "@/assets/gallery/lab.jpg";
import studentPortrait from "@/assets/gallery/student-portrait.jpg";
import math from "@/assets/gallery/math.jpg";
import award from "@/assets/gallery/award.jpg";
import emptyClassroom from "@/assets/gallery/empty-classroom.jpg";
import teacherPortrait from "@/assets/gallery/teacher-portrait.jpg";
import stillLife from "@/assets/gallery/still-life.jpg";

export type GalleryCategory = "Campus" | "Classrooms" | "Faculty" | "Students" | "Moments";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  span?: "tall" | "wide" | "square";
};

export const galleryImages: GalleryImage[] = [
  {
    src: campusExterior,
    alt: "Al-Mustafa Academy campus at sunset",
    caption: "Main Campus, G-11/2",
    category: "Campus",
    span: "wide",
  },
  {
    src: teacherBoard,
    alt: "Teacher writing equations on chalkboard",
    caption: "Mathematics in motion",
    category: "Faculty",
    span: "tall",
  },
  {
    src: studentsGroup,
    alt: "Students collaborating on a problem",
    caption: "Group study session",
    category: "Students",
    span: "tall",
  },
  {
    src: library,
    alt: "Academy reading corner with bookshelves",
    caption: "The Reading Corner",
    category: "Campus",
    span: "square",
  },
  {
    src: notebook,
    alt: "Hands writing in notebook",
    caption: "Quiet hours",
    category: "Moments",
    span: "square",
  },
  {
    src: lab,
    alt: "Science laboratory bench",
    caption: "Science Lab",
    category: "Campus",
    span: "square",
  },
  {
    src: studentPortrait,
    alt: "Student reading by a window",
    caption: "Bright young minds",
    category: "Students",
    span: "tall",
  },
  {
    src: math,
    alt: "Solving math problems with calculator",
    caption: "Practice makes mastery",
    category: "Moments",
    span: "square",
  },
  {
    src: emptyClassroom,
    alt: "Empty classroom in afternoon light",
    caption: "Where lessons begin",
    category: "Classrooms",
    span: "wide",
  },
  {
    src: teacherPortrait,
    alt: "Senior teacher with chalk",
    caption: "Senior Faculty",
    category: "Faculty",
    span: "tall",
  },
  {
    src: award,
    alt: "Student receiving an award",
    caption: "Recognising excellence",
    category: "Moments",
    span: "square",
  },
  {
    src: stillLife,
    alt: "Books and brass lamp still life",
    caption: "Tools of the trade",
    category: "Campus",
    span: "square",
  },
];

export const galleryCategories: ("All" | GalleryCategory)[] = [
  "All",
  "Campus",
  "Classrooms",
  "Faculty",
  "Students",
  "Moments",
];
