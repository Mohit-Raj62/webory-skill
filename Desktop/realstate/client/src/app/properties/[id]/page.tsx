'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    garage: boolean;
    yearBuilt: number;
  };
  amenities: string[];
  images: { url: string; caption: string }[];
  type: string;
  status: string;
  agent: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function PropertyDetails() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      const data = await response.json();
      setProperty(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...contactForm,
          propertyId: property?.id
        })
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-[500px]">
            <Image
              src={property.images[activeImage]?.url || '/images/placeholder.jpg'}
              alt={property.images[activeImage]?.caption || property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 flex gap-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
                aria-label={`View image ${index + 1}${image.caption ? `: ${image.caption}` : ''}`}
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-gray-600">
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
                  <span className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="text-xl font-semibold">{property.features.bedrooms}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Bathrooms</p>
                  <p className="text-xl font-semibold">{property.features.bathrooms}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Area</p>
                  <p className="text-xl font-semibold">{property.features.area} sqft</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Year Built</p>
                  <p className="text-xl font-semibold">{property.features.yearBuilt}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Agent</h2>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">{property.agent.name}</h3>
                <p className="text-gray-600 mb-1">{property.agent.email}</p>
                <p className="text-gray-600">{property.agent.phone}</p>
              </div>
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded border"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    aria-label="Your name"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded border"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    aria-label="Your email"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-2 rounded border"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    aria-label="Your phone number"
                  />
                  <textarea
                    placeholder="Your Message"
                    className="w-full px-4 py-2 rounded border h-32"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    aria-label="Your message"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 