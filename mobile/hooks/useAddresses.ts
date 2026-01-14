import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Address } from "@/types";

const useAddresses = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    const { data: addresses, isLoading, isError } = useQuery({
        queryKey: ["addresses"],
        queryFn: async () => {
            const { data } = await api.get<{ addresses: Address[] }>("/users/getAddresses")
            return data.addresses
        }
    })

    const addAddressMutation = useMutation({
        mutationFn: async (addressesData: Omit<Address, "_id">) => {
            const { data } = await api.post<{ addresses: Address[] }>("/users/addresses", addressesData)
            return data.addresses
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] })
        }
    })

    const updateAddressMutation = useMutation({
        mutationFn: async ({ addressId, addressesData }: { addressId: string, addressesData: Partial<Address> }) => {
            const { data } = await api.put<{ addresses: Address[] }>(`/users/addresses/${addressId}`, addressesData)
            return data.addresses
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] })
        }
    })

    const deleteAddressMutation = useMutation({
        mutationFn: async (addressId: string) => {
            const { data } = await api.delete<{ addresses: Address[] }>(`/users/addresses/${addressId}`)
            return data.addresses
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] })
        }
    })

    return {
        addresses: addresses || [],
        isLoading,
        isError,
        addAddress: addAddressMutation.mutate,
        updateAddress: updateAddressMutation.mutate,
        deleteAddress: deleteAddressMutation.mutate,
        isAddingAddress: addAddressMutation.isPending,
        isUpdatingAddress: updateAddressMutation.isPending,
        isDeletingAddress: deleteAddressMutation.isPending
    }

}

export default useAddresses