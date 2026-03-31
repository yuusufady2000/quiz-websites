
import RegisterPage from "~/components/register";
import type { Route } from "./+types/home";
import Header from "~/components/header";
import Hero from "~/components/hero";
import Footer from "~/components/footer";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz App" },
    { name: "description", content: "Test your knowledge with our interactive quizzes!" },
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
