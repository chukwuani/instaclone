"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

import Terms from "./Terms";
import SignUpWithFaceBook from "./SignUpWithGithub";
import FormDivider from "./FormDivider";
import { icons } from "@/constants";
import { cn } from "@/lib/utils";

import { useSignUp } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const SignupForm = () => {
	const router = useRouter();

	const { signUp, isLoaded } = useSignUp();

	const [user, setUser] = useState({
		email: "",
		password: "",
		username: "",
		fullname: "",
	});

	const [showPassword, setShowPassword] = useState(false);

	const [isPending, startTransition] = useTransition();

	const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isLoaded) return;

		startTransition(async () => {
			try {
				await signUp?.create({
					emailAddress: user.email,
					password: user.password,
					username: user.username,
					firstName: user.fullname.split(" ")[0],
					lastName: user.fullname.split(" ")[1],
				});

				await signUp.prepareEmailAddressVerification({
					strategy: "email_code",
				});

				localStorage.setItem("userData", JSON.stringify(user));
				toast.success("Check your email. We sent you a 6-digit verification code.");
				router.push("/signup/verify-email");
			} catch (err: any) {
				err?.errors?.map((msg: { message: string }) => {
					toast.error(msg.message);
				});
			}
		});
	};

	return (
		<form
			method="post"
			onSubmit={handleSignUp}
			className="flex flex-col justify-center w-full mb-6 !mt-0 signin-form">
			<SignUpWithFaceBook />

			<FormDivider />

			<section className="min-h-[38px] border border-separator-divider bg-secondary-background rounded-[3px] flex flex-col mx-10 mb-[6px] w-auto text-sm leading-normal relative">
				<label
					htmlFor="email"
					className={cn("form-label", user.email && "login-label")}>
					Email
				</label>

				<input
					className={cn("form-input", user.email && "login-input")}
					type="email"
					id="email"
					name="email"
					required
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
				/>
			</section>

			<section className="min-h-[38px] border border-separator-divider bg-secondary-background rounded-[3px] flex flex-col mx-10 mb-[6px] w-auto text-sm leading-normal relative">
				<label
					htmlFor="fullname"
					className={cn("form-label", user.fullname && "login-label")}>
					Full Name
				</label>

				<input
					className={cn("form-input", user.fullname && "login-input")}
					type="text"
					id="fullname"
					required
					name="fullname"
					maxLength={50}
					value={user.fullname}
					onChange={(e) => setUser({ ...user, fullname: e.target.value })}
				/>
			</section>

			<section className="min-h-[38px] border border-separator-divider bg-secondary-background rounded-[3px] flex flex-col mx-10 mb-[6px] w-auto text-sm leading-normal relative">
				<label
					htmlFor="username"
					className={cn("form-label", user.username && "login-label")}>
					Username
				</label>

				<input
					className={cn("form-input", user.username && "login-input")}
					type="text"
					id="username"
					required
					name="username"
					maxLength={50}
					spellCheck={false}
					value={user.username}
					onChange={(e) => setUser({ ...user, username: e.target.value })}
				/>
			</section>

			<section className="min-h-[38px] border border-separator-divider bg-secondary-background rounded-[3px] flex flex-col mx-10 mb-[6px] w-auto text-sm leading-normal relative">
				<label
					htmlFor="password"
					className={cn("form-label", user.password && "login-label")}>
					Password
				</label>

				<input
					type={showPassword ? "text" : "password"}
					id="password"
					required
					name="password"
					minLength={8}
					autoComplete="new-password"
					className={cn("form-input", user.password && "login-input")}
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
				/>

				{user.password.length > 0 && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-0 top-0 text-[10px] text-primary-text bg-secondary-background h-full p-2 font-semibold">
						{showPassword ? "HIDE" : "SHOW"}
					</button>
				)}
			</section>

			<Terms />

			<button
				aria-disabled={isPending}
				className="!opacity-70 login-btn  disabled:!opacity-50 disabled:cursor-auto"
				type="submit">
				{isPending && (
					<Image
						className="mr-2 w-4 h-4 animate-spin"
						src={icons.spinner}
						alt="Loading spinner"
					/>
				)}
				Sign up
			</button>
		</form>
	);
};

export default SignupForm;
