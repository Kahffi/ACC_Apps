import { signUpSchema } from "@/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { database } from "@/firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // initialize user info in realtime database
  function initUserData(userId: string, name: string, email: string) {
    set(ref(database, `users/${userId}`), {
      userId: userId,
      username: name,
      email: email,
      data: {},
    })
      .then(() => console.log("database init complete"))
      .catch((e) => console.error(e));
  }

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCred) => {
        initUserData(userCred.user.uid, values.username, values.email);
        console.log(userCred.user);
        navigate("/");
      })
      .catch((err) => {
        console.error(err.code);
        console.log(err.message);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
              {/* <FormDescription className="w-3/4">
                Gunakan username yang unik dan mudah diingat
              </FormDescription> */}
            </FormItem>
          )}
        />
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
              {/* <FormDescription className="w-3/4">
                Gunakan username yang unik dan mudah diingat
              </FormDescription> */}
            </FormItem>
          )}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {/* <FormDescription className="w-3/4">
                Gunakan username yang unik dan mudah diingat
              </FormDescription> */}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-6 bg-blue-800 font-semibold text-base"
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
