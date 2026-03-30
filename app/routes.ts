import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("quizDisplay", './routes/quizDisplay/index.tsx'),
    route("quizDisplay/:name", './routes/quizDisplay/detail.tsx'),
    route('record.tsx', './components/record.tsx')
] satisfies RouteConfig;
