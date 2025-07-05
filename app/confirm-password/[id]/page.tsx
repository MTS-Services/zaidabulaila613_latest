import ResetPassword from "@/interfaces/auth/newPassword";
import SignIn from "@/interfaces/auth/signIn";

type Props = {
    params: { id: string };
};

export default function Page({ params }: Props) {
    return (
        <>
            <ResetPassword token={params.id} />
        </>
    );
}