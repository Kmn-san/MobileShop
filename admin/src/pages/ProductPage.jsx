import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { productApi } from "../lib/api.js"
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { getStockStatusBadge } from "../lib/utils.js"

const ProductPage = () => {

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  })

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const queryClient = useQueryClient()

  //fetch some data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll
  })
  //creating, update, deleting data 
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const closeModal = () => {
    //reset the state
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    })
    setImages([])
    setImagePreviews([])
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    })
    setImagePreviews(product.images)
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 3) return alert("Maximum 3 images allowed")

    //revoke previous blob URLs to free memory 
    imagePreviews.forEach(url => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url)
    })

    setImages(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    //for new products,require images
    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image")
    }

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("price", formData.price)
    formDataToSend.append("stock", formData.stock)
    formDataToSend.append("category", formData.category)


    // only append new images if they were selected
    if (images.length > 0) images.forEach(image => formDataToSend.append("images", image))

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend })
    } else {
      createProductMutation.mutate(formDataToSend)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER  */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">manage your product inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID  */}
      <div className="grid grid-cols-1 gap-4">

        {products.map(product => {
          const status = getStockStatusBadge(product.stock)

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-6">

                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img src={product.images[0]} alt={product.name} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{product.name}</h3>
                        <p className="text-base-content/70 text-sm">{product.category}</p>
                      </div>
                      <div className={`badge ${status.class}`}>{status.text}</div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-xs text-base-content/70">Price</p>
                        <p className="font-bold text-lg">RM {product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Stock</p>
                        <p className="font-bold text-lg">{product.stock} units</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(product)}>
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="btn btn-square btn-ghost text-error"
                      onClick={() => deleteProductMutation.mutate(product._id)}>
                      {
                        deleteProductMutation.isPending ? (
                          <span className="loading loading-spinner"></span>)
                          : (<Trash2Icon className="w-5 h-5" />)
                      }

                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </div>

      {/* ADD/EDIT PRODUCT MODAL  */}
      <input type="checkbox" checked={showModal} className="modal-toggle" />
      <div className="modal" >
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">

            <h3 className="text-2xl font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME & CATEGORY  */}
            <div className="grid grid-cols-2  gap-4">

              <div className="form-control">
                <label className="label">
                  <span>Product Name</span>
                </label>
                <input type="text" placeholder="Enter product name" className="input input-bordered" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select className="select select-bordered" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} required >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                </select>
              </div>
            </div>

            {/* Price & Stock  */}
            <div className="grid grid-cols-2  gap-4">

              <div className="form-control">
                <label className="label">
                  <span>Price (RM)</span>
                </label>
                <input type="number" min="0" step="0.01" placeholder="0.00" className="input input-bordered" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Stock</span>
                </label>
                <input type="number" min="0" placeholder="0" className="input input-bordered" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
            </div>

            {/* DESCRIPTION  */}
            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span>Description</span>
              </label>
              <textarea placeholder="Enter product description" className="textarea textarea-bordered h-24 w-full"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>

            {/* IMAGES  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
              </label>
              <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary
              transition-colors">
                <input type="file" accept="image/*" multiple
                  className="file-input file-input-bordered file-input-primary w-full"
                  onChange={handleImageChange} required={!editingProduct} />

                {editingProduct && (
                  <p className="text-xs text-base-content/600 mt-2 text-center">
                    Leave empty to keep current images
                  </p>
                )}
              </div>
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="avatar">
                      <div className="w-20 rounded-lg">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CANCEL && SUBMIT  */}
            <div className="modal-action">
              {/* CANCEL  */}
              <button type="button" onClick={closeModal} className="btn"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                Cancel
              </button>

              {/* SUBMIT  */}
              <button type="submit" className="btn btn-primary"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                {/* EDITING or CREATING  */}
                {createProductMutation.isPending || updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                  // EDIT or ADD 
                ) : editingProduct ? (
                  "Update Product") : (
                  "Add Product"
                )}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  )
}

export default ProductPage