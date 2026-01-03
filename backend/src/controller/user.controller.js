import { User } from "../models/user.model.js"

export async function addAddress(req, res) {
    try {
        const { label, fullname, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body

        const user = req.user

        //is this is set as default , unset all other defaults
        if (isDefault) {
            user.addresses.forEach((addr) => { addr.isdDefault = false })
        }

        user.addresses.push({
            label, fullname, streetAddress, city, state, zipCode, phoneNumber, isdDefault: isDefault || false
        })

        await user.save()

        res.status(201).json({ message: "Address added successfullt", addresses: user.addresses })
    } catch (error) {
        console.error("Error in addAddress controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }

}

export async function getAddress(req, res) {
    try {
        const user = req.user

        res.status(200).json({ addresses: user.addresses })
    } catch (error) {
        console.error("Error in getAddress controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateAddress(req, res) {
    try {
        const { label, fullname, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body
        const { addressId } = req.params()

        const user = req.user
        const address = user.addresses.id(addressId)
        if (!address) {
            return res.status(404).json({ error: "Address not found" })
        }
        //is this is set as default , unset all other defaults
        if (isDefault) {
            user.addresses.forEach((addr) => { addr.isdDefault = false })
        }
        address.label = label || address.label
        address.fullname = fullname || address.fullname
        address.streetAddress = streetAddress || address.streetAddress
        address.city = city || address.city
        address.state = state || address.state
        address.zipCode = zipCode || address.zipCode
        address.phoneNumber = phoneNumber || address.phoneNumber
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault

        await user.save()

        res.status(200).json({ message: "Address updates successfully", addresses: user.addresses })


    } catch (error) {
        console.error("Error in updateAddress controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params()
        const user = req.user
        user.addresses.pull(addressId)

        await user.save()

        return res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses })
    } catch (error) {
        console.error("Error in deleteAddress controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function addToWishlist(req, res) {
    try {
        const { productId } = req.body
        const user = req.user

        //check if product is already in the wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ error: "Product already in wishlist" })
        }

        user.wishlist.push(productId)
        await user.save()

        return res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist })
    } catch (error) {
        console.error("Error in addToWishlist controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const { productId } = req.params()
        const user = req.user

        //check if product is already in the wishlist
        if (!user.wishlist.includes(productId)) {
            return res.status(400).json({ error: "Product is not even in wishlist" })
        }

        user.wishlist.pull(productId)
        await user.save()

        return res.status(200).json({ message: "Product removed from wishlist" })

    } catch (error) {
        console.error("Error in removeFromWishlist controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function getWishlist(req, res) {
    try {
        const user = req.user
        res.status(200).json({ wishlist: user.wishlist })
    } catch (error) {
        console.error("Error in getWishlist controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

