import { useState } from 'react';
import ShippingAddress from './ShippingAddress';

export default function CheckoutForm({ user, onSubmit, disabled }) {
  const defaultAddress = user.addresses?.[0] || {};
  
  const [contact, setContact] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || defaultAddress.phone || '',
  });

  const [address, setAddress] = useState({
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || defaultAddress.firstName ? `${defaultAddress.firstName} ${defaultAddress.lastName}` : '',
    street: defaultAddress.address || '',
    city: defaultAddress.city || '',
    state: defaultAddress.province || '',
    zip: defaultAddress.postalCode || '',
    country: defaultAddress.country || 'United States',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!contact.firstName) newErrors.firstName = 'First name is required';
    if (!contact.lastName) newErrors.lastName = 'Last name is required';
    if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) newErrors.email = 'Valid email is required';
    
    if (!address.fullName) newErrors.addressFullName = 'Full name is required';
    if (!address.street) newErrors.street = 'Street address is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.zip) newErrors.zip = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ contact, address });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-neutral-100">
      {/* Contact Information */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium text-neutral-900">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              value={contact.firstName}
              onChange={(e) => setContact({...contact, firstName: e.target.value})}
              className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              value={contact.lastName}
              onChange={(e) => setContact({...contact, lastName: e.target.value})}
              className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={contact.email}
              onChange={(e) => setContact({...contact, email: e.target.value})}
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50`}
              disabled
            />
            <p className="mt-1 text-xs text-neutral-500">Email is linked to your account.</p>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">Phone (optional)</label>
            <input 
              type="tel" 
              id="phone" 
              value={contact.phone}
              onChange={(e) => setContact({...contact, phone: e.target.value})}
              className="w-full border border-neutral-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>
      </section>

      <section>
        <ShippingAddress 
          address={address} 
          onChange={setAddress} 
          errors={{
            fullName: errors.addressFullName,
            street: errors.street,
            city: errors.city,
            zip: errors.zip
          }} 
        />
      </section>

      <div className="pt-8 border-t border-neutral-200">
        <button 
          type="submit" 
          disabled={disabled}
          className="w-full bg-neutral-900 text-white px-6 py-4 text-sm font-medium tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
