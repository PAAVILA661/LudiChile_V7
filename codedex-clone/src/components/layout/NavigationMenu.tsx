import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavigationMenu = () => {
  const navItems = [
    {
      label: "Aprender",
      dropdownItems: [
        { label: "Python", href: "/python" },
        { label: "Python Intermedio", href: "/intermediate-python" },
        { label: "NumPy", href: "/numpy" },
        { label: "SQL", href: "/sql" },
        { label: "IA Generativa", href: "/gen-ai" },
        { label: "HTML", href: "/html" },
        { label: "CSS", href: "/css" },
        { label: "JavaScript", href: "/javascript" },
        { label: "JavaScript Intermedio", href: "/intermediate-javascript" },
        { label: "React", href: "/react" },
        { label: "p5.js", href: "/p5js" },
        { label: "Node.js", href: "/nodejs" },
        { label: "Línea de Comandos", href: "/command-line" },
        { label: "Git y GitHub", href: "/git-github" },
        { label: "C++", href: "/cpp" },
        { label: "Java", href: "/java" },
      ],
    },
    {
      label: "Practicar",
      dropdownItems: [
        { label: "Desafíos", href: "/challenges" },
        { label: "Proyectos", href: "/projects" },
        { label: "#30NochesDeCódigo", href: "/30-nites-of-code" },
      ],
    },
    {
      label: "Construir",
      href: "/builds",
    },
    {
      label: "Comunidad",
      href: "/community",
      dropdownItems: [
        { label: "Inicio", href: "/community" },
        { label: "Tablas de Clasificación", href: "/community/leaderboards" },
        {
          label: "Exhibición de Proyectos",
          href: "/community/project-showcase",
        },
        { label: "Desafío Mensual", href: "/community/monthly-challenge" },
      ],
    },
    {
      label: "Precios",
      href: "/pricing",
    },
  ];

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        if (item.dropdownItems) {
          return (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <Button className="text-codedex-gold hover:text-white px-4 py-2 flex items-center gap-1">
                  {item.label}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-codedex-navy border border-codedex-gold/30 w-56">
                {item.dropdownItems.map((dropdownItem) => (
                  <DropdownMenuItem key={dropdownItem.label} asChild>
                    <Link
                      href={dropdownItem.href}
                      className="text-codedex-gold hover:bg-codedex-gold/10 focus:bg-codedex-gold/10 cursor-pointer px-4 py-2"
                    >
                      {dropdownItem.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Button
            key={item.label}
            className="text-codedex-gold hover:text-white px-4 py-2"
            asChild
          >
            <Link href={item.href || "#"}>{item.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;
