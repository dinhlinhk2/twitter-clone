import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../utils/axios"
import toast from "react-hot-toast"

const useFollow = () => {
    const queryClient = useQueryClient()
    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (id) => {
            try {
                const res = await axiosInstance.post(`/user/follow/${id}`)
                return res.data
            } catch (error) {
                console.log(error);
                throw error.response.data
            }
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ['suggestuser'] }),
                queryClient.invalidateQueries({ queryKey: ['authuser'] })
            ])
        }
    })
    return { follow, isPending }
}

export default useFollow
