import SignIn from "@/interfaces/auth/signIn";
import { useTranslation } from "@/hooks/use-translation";
import Dashboard from "@/interfaces/dashboards/home";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/graphql/query";

export default function Page() {
    
  
    return (
        <>
            

            <Dashboard />
        </>
    );
}