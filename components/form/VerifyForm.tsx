"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useSignUp } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { icons } from "@/constants";
import { cn } from "@/lib/utils";

const VerifyForm = () => {
	const router = useRouter();
	const { isLoaded, signUp, setActive } = useSignUp();
	const [isPending, startTransition] = useTransition();

	const [code, setCode] = useState("");

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!isLoaded) return;

		startTransition(async () => {
			await signUp
				.attemptEmailAddressVerification({
					code,
				})
				.then((result) => {
					if (result.status === "complete") {
						localStorage.removeItem("userData");
						setActive({ session: result.createdSessionId });
					} else {
						toast(JSON.stringify(result, null, 2));
						console.log(result);
					}

					router.push(`${window.location.origin}/`);
				})
				.catch((err) =>
					err?.errors?.map((msg: { message: string }) => {
						toast.error(msg.message);
					})
				);
		});
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col justify-center w-full">
				<section className="min-h-[38px] border border-separator-divider bg-secondary-background rounded-[3px] flex flex-col mx-10 mb-[6px] w-auto text-sm leading-normal relative">
					<label
						className={cn("form-label", code && "login-label")}
						htmlFor="number">
						Confirmation Code
					</label>

					<input
						type="text"
						id="code"
						name="code"
						maxLength={8}
						minLength={6}
						autoComplete="false"
						className={cn("form-input", code && "login-input")}
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
				</section>

				<button
					aria-disabled={isPending}
					type="submit"
					className="login-btn disabled:opacity-70 disabled:cursor-auto">
					{isPending && (
						<Image
							className="mr-2 w-4 h-4 animate-spin"
							src={icons.spinner}
							alt="Loading spinner"
						/>
					)}
					Next
				</button>
			</form>
			<button
				onClick={router.back}
				className="mt-4 mb-2 text-sm text-primary-button font-semibold hover:text-link">
				Go Back
			</button>
		</>
	);
};

export default VerifyForm;
