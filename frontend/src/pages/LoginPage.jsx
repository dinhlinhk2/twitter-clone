import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../components/svgs/X";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const queryClient = useQueryClient()
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: async (user) => {
            try {
                const res = await axiosInstance.post('/auth/login', user)
                return res
            } catch (error) {
                console.log(error);
                throw error.response.data
            }
        },
        onSuccess: () => {
            toast.success('Login Success!')
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
    const validData = () => {
        if (!formData.username.trim()) {
            return toast.error('FullName is required!');
        }
        if (!formData.password) return toast.error('Password is required!');
        if (formData.password.length < 4) return toast.error('Password must be at 4 char');
        return true;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validData()
        if (success) mutate(formData)
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            <div className="flex-1 hidden lg:flex items-center  justify-center">
                <XSvg className="lg:w-2/3 fill-white" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
                <form className=" flex gap-4 flex-col" onSubmit={handleSubmit}>
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type="text"
                            className="grow"
                            placeholder="username"
                            name="username"
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className="btn rounded-full btn-primary text-white">
                        {isPending ? 'Loading' : 'Login'}
                    </button>
                    {isError && <p className="text-red-500">{error}</p>}
                </form>
                <div className="flex flex-col gap-2 mt-4">
                    <p className="text-white text-lg">{"Don't"} have an account?</p>
                    <Link to="/register">
                        <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
