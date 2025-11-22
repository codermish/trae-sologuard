import React, { useState } from 'react';
import { CreditCard, User, Calendar, MapPin, Mail, Phone, Users, ChevronRight, ChevronLeft, Check, Plane } from 'lucide-react';

interface BookingItem {
  id: string;
  type: 'hotel' | 'flight';
  name: string;
  price: number;
  details: any;
}

interface BookingFormProps {
  item: BookingItem;
  onComplete: (bookingData: any) => void;
  onCancel: () => void;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function BookingForm({ item, onComplete, onCancel }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: ''
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { number: 1, title: 'Guest Information', icon: User },
    { number: 2, title: 'Payment Details', icon: CreditCard },
    { number: 3, title: 'Review & Confirm', icon: Check }
  ];

  const validateGuestInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!guestInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!guestInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!guestInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) newErrors.email = 'Email is invalid';
    if (!guestInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!guestInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!guestInfo.nationality.trim()) newErrors.nationality = 'Nationality is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!paymentInfo.cardHolder.trim()) newErrors.cardHolder = 'Card holder name is required';
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Expiry date must be MM/YY format';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
    
    if (!paymentInfo.billingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!paymentInfo.billingAddress.city.trim()) newErrors.city = 'City is required';
    if (!paymentInfo.billingAddress.state.trim()) newErrors.state = 'State is required';
    if (!paymentInfo.billingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!paymentInfo.billingAddress.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateGuestInfo()) {
        setCurrentStep(2);
        setErrors({});
      }
    } else if (currentStep === 2) {
      if (validatePaymentInfo()) {
        setCurrentStep(3);
        setErrors({});
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const bookingData = {
        item,
        guestInfo,
        paymentInfo,
        bookingDate: new Date().toISOString(),
        totalAmount: item.price,
        bookingReference: 'BK' + Date.now().toString().slice(-8)
      };
      
      onComplete(bookingData);
      setIsProcessing(false);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > step.number ? (
                <Check size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <span className="text-xs font-medium mt-2 text-center max-w-20">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 transition-colors duration-200 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderGuestInfoStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Booking Details</h3>
        <div className="flex items-center space-x-2 text-blue-800">
          {item.type === 'hotel' ? <MapPin size={16} /> : <Plane size={16} />}
          <span>{item.name}</span>
        </div>
        <p className="text-blue-700 font-semibold mt-1">${item.price}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={guestInfo.firstName}
            onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={guestInfo.lastName}
            onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          value={guestInfo.email}
          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="john.doe@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          value={guestInfo.phone}
          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          <input
            type="date"
            value={guestInfo.dateOfBirth}
            onChange={(e) => setGuestInfo({ ...guestInfo, dateOfBirth: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
          <input
            type="text"
            value={guestInfo.nationality}
            onChange={(e) => setGuestInfo({ ...guestInfo, nationality: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nationality ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="United States"
          />
          {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-yellow-800">
          <CreditCard size={16} />
          <span className="font-semibold">Secure Payment</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Your payment information is encrypted and secure. We never store your credit card details.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
        <input
          type="text"
          value={formatCardNumber(paymentInfo.cardNumber)}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
        <input
          type="text"
          value={paymentInfo.cardHolder}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardHolder ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="JOHN DOE"
        />
        {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
          <input
            type="text"
            value={paymentInfo.expiryDate}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
              }
              setPaymentInfo({ ...paymentInfo, expiryDate: value });
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
          <input
            type="text"
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
            <input
              type="text"
              value={paymentInfo.billingAddress.street}
              onChange={(e) => setPaymentInfo({
                ...paymentInfo,
                billingAddress: { ...paymentInfo.billingAddress, street: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main Street"
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                value={paymentInfo.billingAddress.city}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, city: e.target.value }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="New York"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                type="text"
                value={paymentInfo.billingAddress.state}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, state: e.target.value }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="NY"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
              <input
                type="text"
                value={paymentInfo.billingAddress.zipCode}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, zipCode: e.target.value }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10001"
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input
                type="text"
                value={paymentInfo.billingAddress.country}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, country: e.target.value }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="United States"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-green-800">
          <Check size={16} />
          <span className="font-semibold">Booking Summary</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Please review your booking details before confirming.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Item:</span>
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{item.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${item.price}</span>
          </div>
        </div>
      </div>

      {/* Guest Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Guest Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{guestInfo.firstName} {guestInfo.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{guestInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{guestInfo.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nationality:</span>
            <span className="font-medium">{guestInfo.nationality}</span>
          </div>
        </div>
      </div>

      {/* Payment Information (Masked) */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Card:</span>
            <span className="font-medium">**** **** **** {paymentInfo.cardNumber.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cardholder:</span>
            <span className="font-medium">{paymentInfo.cardHolder}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Billing Address:</span>
            <span className="font-medium">
              {paymentInfo.billingAddress.street}, {paymentInfo.billingAddress.city}
            </span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">${item.price}</span>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and 
          <a href="#" className="text-blue-600 hover:underline">privacy policy</a>.
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
        <p className="text-blue-100">Secure booking process - your information is protected</p>
      </div>

      {/* Step Indicator */}
      <div className="p-6">
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && renderGuestInfoStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && renderReviewStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            onClick={currentStep === 1 ? onCancel : handleBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            disabled={isProcessing}
          >
            <ChevronLeft size={16} />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <div className="flex space-x-3">
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                disabled={isProcessing}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            )}
            
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}