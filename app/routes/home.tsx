
import RegisterPage from "~/components/register";
import type { Route } from "./+types/home";
import Header from "~/components/header";
import Hero from "~/components/hero";
import Footer from "~/components/footer";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
  <div>
    <Header/>
    <Hero/>
    <RegisterPage/>
    <Footer/>
  </div>
  );
}
