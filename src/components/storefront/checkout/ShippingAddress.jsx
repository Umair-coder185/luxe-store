export default function ShippingAddress({ address, onChange, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...address, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-neutral-900">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={`w-full border ${errors?.fullName ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            placeholder="Jane Doe"
          />
          {errors?.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
          <input 
            type="text" 
            id="street" 
            name="street"
            value={address.street}
            onChange={handleChange}
            className={`w-full border ${errors?.street ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            placeholder="123 Luxury Ave"
          />
          {errors?.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
          <input 
            type="text" 
            id="city" 
            name="city"
            value={address.city}
            onChange={handleChange}
            className={`w-full border ${errors?.city ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            placeholder="New York"
          />
          {errors?.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">State / Province</label>
          <input 
            type="text" 
            id="state" 
            name="state"
            value={address.state}
            onChange={handleChange}
            className="w-full border border-neutral-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="NY"
          />
        </div>

        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-neutral-700 mb-1">Postal Code</label>
          <input 
            type="text" 
            id="zip" 
            name="zip"
            value={address.zip}
            onChange={handleChange}
            className={`w-full border ${errors?.zip ? 'border-red-500' : 'border-neutral-300'} px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900`}
            placeholder="10001"
          />
          {errors?.zip && <p className="mt-1 text-xs text-red-600">{errors.zip}</p>}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
          <select
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            className="w-full border border-neutral-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Pakistan">Pakistan</option>
          </select>
        </div>
      </div>
    </div>
  );
}
