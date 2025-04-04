import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";


const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { mutateAsync: update, isPending: isUpdating } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await axiosInstance.post('/user/update', formData)
                return res.data
            } catch (error) {
                console.log(error);
                throw error.response.data
            }
        },
        onSuccess: () => {
            toast.success('Update Success')
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ['authuser'] }),
                queryClient.invalidateQueries({ queryKey: ['userprofile'] })
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return { update, isUpdating }
}

export default useUpdateProfile