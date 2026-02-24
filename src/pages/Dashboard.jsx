import { useEffect, useState, useRef } from 'react';
import { db, storage } from '../firebase';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProductCard from '../components/ProductCard';

// Admin dashboard: add products and view existing ones
export default function Dashboard() {
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', phone: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If a file was selected but not uploaded yet, upload it first
      if (file && !form.image) {
        setUploading(true);
        const uploadedUrl = await uploadFileAndGetURL(file);
        setForm(prev => ({ ...prev, image: uploadedUrl }));
        setUploading(false);
      }
      let message = 'Product added';
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), { ...form, updatedAt: serverTimestamp() });
        setEditingId(null);
        message = 'Product updated';
      } else {
        await addDoc(collection(db, 'products'), { ...form, createdAt: serverTimestamp() });
      }
      setForm({ name: '', price: '', description: '', image: '', phone: '', category: '' });
      setFile(null);
      setPreview(null);
      await fetchProducts();
      alert(message);
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const uploadFileAndGetURL = async (fileToUpload) => {
    try {
      const path = `products/${Date.now()}_${fileToUpload.name}`;
      const ref = storageRef(storage, path);
      const snap = await uploadBytes(ref, fileToUpload);
      const url = await getDownloadURL(snap.ref);
      return url;
    } catch (err) {
      console.error('Upload failed', err);
      alert('Image upload failed');
      return null;
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      // auto-upload
      setUploading(true);
      const url = await uploadFileAndGetURL(f);
      if (url) setForm(prev => ({ ...prev, image: url }));
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setUploading(true);
      const url = await uploadFileAndGetURL(f);
      if (url) setForm(prev => ({ ...prev, image: url }));
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name || '', price: product.price || '', description: product.description || '', image: product.image || '', phone: product.phone || '' });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-brand mb-6">Admin Dashboard</h1>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Add Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="p-3 border rounded-lg" />
            <input required value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" className="p-3 border rounded-lg" />
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">Image (drag & drop or click)</label>
              <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-dashed border-2 border-gray-300 p-4 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {preview ? (
                  <img src={preview} alt="preview" className="h-40 object-contain" />
                ) : (
                  <div className="text-center text-sm text-gray-500">Drop an image here or click to select</div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
              {form.image && !uploading && <p className="text-sm text-green-600 mt-2">Image ready</p>}
            </div>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="WhatsApp phone (optional)" className="p-3 border rounded-lg" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="p-3 border rounded-lg">
              <option value="">Select category</option>
              <option value="Socks">Socks</option>
              <option value="Caps">Caps</option>
              <option value="Wallets">Wallets</option>
              <option value="Shoes">Shoes</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
              <option value="Bags">Bags</option>
              <option value="Uncategorized">Uncategorized</option>
            </select>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="p-3 border rounded-lg md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" disabled={loading || uploading} className="bg-brand text-white py-3 px-6 rounded-lg font-bold hover:scale-105 transition-transform">
                {loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Product')}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col gap-3">
                <ProductCard product={p} lang={'en'} />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => handleEdit(p)} className="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}