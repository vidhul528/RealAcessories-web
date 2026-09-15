'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Package,
  Heart,
  Save,
  X,
  Building,
  Globe,
  Compass,
  Search,
  Home,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userAPI, AddressPayload } from '@/Api/user/user';
import BikeLogo from '@/components/BikeLogo';

interface AddressItem extends AddressPayload {
  _id?: string;
  id?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout, setUser } = useAuth();
  const { showToast } = useToast();

  // Search Bar State (Matching Home Page Top Navbar)
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Helper for First & Second Name Initials (e.g. "Vidhu Prasad" -> "VP")
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Address State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressSaving, setAddressSaving] = useState(false);

  // Address Form Fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [isDefault, setIsDefault] = useState(false);

  // Feedback State
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to Home page if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load latest profile & addresses from server
  const fetchProfileData = async () => {
    setLoadingData(true);
    try {
      const res = await userAPI.getProfile();
      if (res.success && res.data) {
        const userData = res.data.user || res.data;
        setUser(userData);
        setName(userData.name || '');
        setPhone(userData.phone || userData.mobileNumber || '');
        if (Array.isArray(userData.addresses)) {
          setAddresses(userData.addresses);
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        setName(user.name || '');
        setPhone(user.phone || '');
        if (Array.isArray(user.addresses)) {
          setAddresses(user.addresses);
        }
      }
      fetchProfileData();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setProfileSaving(true);

    const res = await userAPI.updateProfile({ name, phone });
    setProfileSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
      fetchProfileData();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update profile' });
    }
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('India');
    setIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: AddressItem) => {
    const addrId = addr._id || addr.id || '';
    setEditingAddressId(addrId);
    setStreet(addr.street || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setZipCode(addr.zipCode || '');
    setCountry(addr.country || 'India');
    setIsDefault(!!addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setAddressSaving(true);

    const payload: AddressPayload = {
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
    };

    let res;
    if (editingAddressId) {
      res = await userAPI.editAddress(editingAddressId, payload);
    } else {
      res = await userAPI.addAddress(payload);
    }

    setAddressSaving(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: editingAddressId ? 'Address updated successfully!' : 'New address added successfully!',
      });
      setIsAddressModalOpen(false);
      fetchProfileData();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to save address' });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setMessage(null);
    const res = await userAPI.deleteAddress(addressId);
    if (res.success) {
      setMessage({ type: 'success', text: 'Address removed' });
      fetchProfileData();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to delete address' });
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    router.push('/');
  };

  if (authLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-[#F0D0D9]">
          <div className="w-6 h-6 border-2 border-[#8C254F] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#581C38]">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF0F3] text-[#2D1823] font-sans pb-28">
      {/* Top Navbar (Same as Home Page) */}
      <header className="sticky top-0 z-50 bg-[#581C38] text-white shadow-lg border-b border-[#8C254F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {showSearch ? (
            /* Full-Width Search Bar */
            <div className="w-full flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 border border-white/20 animate-fadeIn">
              <Search className="w-5 h-5 text-white/70 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, jewelry, accessories..."
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                title="Close Search"
                className="p-1 rounded-lg text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Header with Brand Heading on Left, Search Icon on Right */
            <>
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8C254F] border border-white/20 flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <BikeLogo size={32} />
                </div>
                <div className="flex items-center tracking-tight">
                  <span className="text-base sm:text-xl font-black text-white italic tracking-wider">REAL</span>
                  <span className="text-base sm:text-xl font-light text-white/90 ml-1">ACCESSORIES</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  title="Search"
                  aria-label="Search"
                  className="p-2 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isAuthenticated && (
                  <div
                    title={user?.name || 'Logged in user'}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#8C254F] to-[#a32e5d] text-white border border-white/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-md select-none shrink-0"
                  >
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Page Breadcrumb Trail (Home / Account) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6E5360] font-medium bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#F0D0D9] shadow-sm w-fit">
          <Link href="/" className="hover:text-[#8C254F] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-[#8C254F]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#581C38] font-extrabold">Account</span>
        </nav>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 space-y-6">
        {/* Banner Alert Feedback */}
        {message && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-sm animate-fadeIn ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Info Hero Card (Compact Layout) */}
        <section className="bg-gradient-to-br from-[#47122A] via-[#581C38] to-[#2B0818] rounded-2xl p-4 text-white shadow-md border border-[#8C254F]/30 relative overflow-hidden flex items-center gap-4">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#8C254F]/20 rounded-full blur-xl pointer-events-none" />

          {/* Left Side: Profile Logo / Avatar with Initials */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#8C254F] to-[#a32e5d] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border-2 border-white/20 shrink-0 z-10">
            {getInitials(user?.name)}
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 space-y-1 z-10 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight truncate">{user?.name || 'Account Holder'}</h1>
              {user?.isVerified !== false && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-xs text-white/80 font-light">
              <div className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 text-[#F5C2D2] shrink-0" />
                <span className="truncate">{user?.email || 'N/A'}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-1 truncate">
                  <Phone className="w-3 h-3 text-[#F5C2D2] shrink-0" />
                  <span className="truncate">{user.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsEditingProfile((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] border border-white/10 cursor-pointer active:scale-95 transition-all"
              >
                <Edit2 className="w-3 h-3 text-[#F5C2D2]" />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-white font-semibold text-[11px] border border-white/10 cursor-pointer active:scale-95 transition-all"
              >
                <LogOut className="w-3 h-3 text-rose-300" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </section>

        {/* Edit Profile Form Collapsible */}
        {isEditingProfile && (
          <section className="bg-white rounded-3xl p-6 border border-[#F0D0D9] shadow-md space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D0D9]">
              <h2 className="text-base font-extrabold text-[#581C38] flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#8C254F]" />
                Update Personal Information
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#581C38] hover:bg-[#8C254F] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {profileSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Quick Links Row */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/#orders"
            className="p-4 rounded-2xl bg-white border border-[#F0D0D9] shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-[#FDF0F3] text-[#8C254F] group-hover:bg-[#8C254F] group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#581C38]">My Orders</h3>
              <p className="text-[10px] text-gray-500">Track shipments</p>
            </div>
          </Link>

          <Link
            href="/#wishlist"
            className="p-4 rounded-2xl bg-white border border-[#F0D0D9] shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-[#FDF0F3] text-[#8C254F] group-hover:bg-[#8C254F] group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#581C38]">Wishlist</h3>
              <p className="text-[10px] text-gray-500">Saved items</p>
            </div>
          </Link>

          <button
            onClick={openAddAddressModal}
            className="p-4 rounded-2xl bg-white border border-[#F0D0D9] shadow-sm hover:shadow-md transition-all flex items-center gap-3 group text-left cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="p-2.5 rounded-xl bg-[#FDF0F3] text-[#8C254F] group-hover:bg-[#8C254F] group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#581C38]">Add Address</h3>
              <p className="text-[10px] text-gray-500">New delivery spot</p>
            </div>
          </button>
        </section>

        {/* Addresses Management Section */}
        <section className="bg-white rounded-3xl p-6 border border-[#F0D0D9] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0D0D9]">
            <h2 className="text-base font-extrabold text-[#581C38] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8C254F]" />
              Saved Delivery Addresses ({addresses.length})
            </h2>

            <button
              onClick={openAddAddressModal}
              className="px-3 py-1.5 rounded-xl bg-[#581C38] hover:bg-[#8C254F] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] text-[#8C254F] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-gray-500">No saved addresses yet.</p>
              <button
                onClick={openAddAddressModal}
                className="px-4 py-2 rounded-xl bg-[#8C254F] text-white font-bold text-xs shadow-sm hover:bg-[#581C38] transition-all cursor-pointer"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => {
                const addrId = addr._id || addr.id || String(idx);
                return (
                  <div
                    key={addrId}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? 'bg-[#FDF0F3]/60 border-[#8C254F] shadow-sm'
                        : 'bg-white border-[#F0D0D9]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#581C38] flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#8C254F]" />
                          Address #{idx + 1}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-[#8C254F] text-white text-[10px] font-bold">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed pt-1">
                        {addr.street && `${addr.street}, `}
                        {addr.city && `${addr.city}, `}
                        {addr.state && `${addr.state} `}
                        {addr.zipCode && `- ${addr.zipCode}`}
                      </p>
                      {addr.country && (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <span>{addr.country}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#F0D0D9]/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditAddressModal(addr)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#8C254F] hover:bg-[#8C254F]/10 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(addrId)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Address Modal (Add / Edit) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#F0D0D9] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0D0D9]">
              <h3 className="text-base font-extrabold text-[#581C38] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#8C254F]" />
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#581C38]">Street / House No. / Area</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="123 Luxury Lane, Suite 4B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">Pincode / Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#581C38]">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0D0D9] text-xs focus:outline-none focus:border-[#8C254F] focus:ring-1 focus:ring-[#8C254F]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-[#F0D0D9] text-[#8C254F] focus:ring-[#8C254F] w-4 h-4"
                />
                <span className="text-xs font-medium text-[#581C38]">Set as default shipping address</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0D0D9]">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addressSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#581C38] hover:bg-[#8C254F] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {addressSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingAddressId ? 'Save Changes' : 'Add Address'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
