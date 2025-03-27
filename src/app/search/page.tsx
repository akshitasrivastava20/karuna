'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, User, Hospital } from 'lucide-react';

// Define types
type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  address: string;
  rating: number;
  experience: number;
  image?: string;
};

type Hospital = {
  id: string;
  name: string;
  address: string;
  type: string;
  beds: number;
  rating: number;
  image?: string;
  specialties: string[];
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState<{
    doctors: Doctor[];
    hospitals: Hospital[];
  }>({ doctors: [], hospitals: [] });
  const [loading, setLoading] = useState(false);

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&filter=${filter}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter key or filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [filter]);

//   Render stars for ratings
    const renderRating = (rating: number | string | null | undefined) => {
    const numericRating = typeof rating === "number" ? rating : parseFloat(rating as string);
    
    if (isNaN(numericRating)) {
      return <span className="ml-1 text-sm text-gray-600">N/A</span>;
    }
  
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.round(numericRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{numericRating.toFixed(1)}</span>
      </div>
    );
  };
  
//   Render doctor card
  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-3">
            <User size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            <p className="text-gray-600 text-sm mt-1">{doctor.hospital}</p>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <MapPin size={14} className="mr-1" />
              <p>{doctor.address}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              {renderRating(doctor.rating)}
              <span className="text-gray-600 text-sm">{doctor.experience} yrs exp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render hospital card
  const HospitalCard = ({ hospital }: { hospital: Hospital }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-3">
            <Hospital size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{hospital.name}</h3>
            <p className="text-green-600 font-medium">{hospital.type}</p>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <MapPin size={14} className="mr-1" />
              <p>{hospital.address}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              {renderRating(hospital.rating)}
              <span className="text-gray-600 text-sm">{hospital.beds} beds</span>
            </div>
            {hospital.specialties && (
              <div className="mt-2 flex flex-wrap gap-1">
                {hospital.specialties.slice(0, 3).map((specialty, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
                {hospital.specialties.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    +{hospital.specialties.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search hospitals or doctors..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'doctors'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setFilter('doctors')}
              >
                Doctors
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'hospitals'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setFilter('hospitals')}
              >
                Hospitals
              </button>
            </div>

            {/* Search Button (for mobile) */}
            <button
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {/* Result counts */}
            <div className="mb-4">
              <p className="text-gray-600">
                {filter === 'all' && `Found ${results.doctors.length + results.hospitals.length} results`}
                {filter === 'doctors' && `Found ${results.doctors.length} doctors`}
                {filter === 'hospitals' && `Found ${results.hospitals.length} hospitals`}
              </p>
            </div>

            {/* Doctors section */}
            {(filter === 'all' || filter === 'doctors') && results.doctors.length > 0 && (
              <div className="mb-8">
                {filter === 'all' && <h2 className="text-xl font-semibold mb-4">Doctors</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            )}

            {/* Hospitals section */}
            {(filter === 'all' || filter === 'hospitals') && results.hospitals.length > 0 && (
              <div>
                {filter === 'all' && <h2 className="text-xl font-semibold mb-4">Hospitals</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.hospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {((filter === 'all' && results.doctors.length === 0 && results.hospitals.length === 0) ||
              (filter === 'doctors' && results.doctors.length === 0) ||
              (filter === 'hospitals' && results.hospitals.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Search, MapPin, Star, User, Hospital } from 'lucide-react';

// // Define types
// type Doctor = {
//   id?: string;
//   name: string;
//   specialization: string;
//   hospital: string;
//   address: string;
//   rating: number;
//   experience: number;
//   image?: string;
// };

// type Hospital = {
//   id?: string;
//   name: string;
//   address: string;
//   type: string;
//   beds: number;
//   rating: number;
//   image?: string;
//   specialties: string[];
// };

// export default function SearchPage() {
//   const [query, setQuery] = useState('');
//   const [filter, setFilter] = useState('all');
//   const [results, setResults] = useState<{
//     doctors: Doctor[];
//     hospitals: Hospital[];
//   }>({ doctors: [], hospitals: [] });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     console.log("Fetched results:", results); // Debugging line
//   }, [results]);

//   // Search function
//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `/api/search?query=${encodeURIComponent(query)}&filter=${filter}`
//       );
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search on Enter key or filter change
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [filter]);

//   // Render stars for ratings
//   const renderRating = (rating: number | string | null | undefined) => {
//     const numericRating = typeof rating === "number" ? rating : parseFloat(rating as string);
    
//     if (isNaN(numericRating)) {
//       return <span className="ml-1 text-sm text-gray-600">N/A</span>;
//     }
  
//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             size={16}
//             className={i < Math.round(numericRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
//           />
//         ))}
//         <span className="ml-1 text-sm text-gray-600">{numericRating.toFixed(1)}</span>
//       </div>
//     );
//   };
  
//   // Render doctor card
//   const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="p-4">
//         <div className="flex items-start">
//           <div className="bg-blue-100 p-3 rounded-full mr-3">
//             <User size={24} className="text-blue-600" />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-lg">{doctor.name}</h3>
//             <p className="text-blue-600 font-medium">{doctor.specialization}</p>
//             <p className="text-gray-600 text-sm mt-1">{doctor.hospital}</p>
//             <div className="flex items-center mt-1 text-gray-500 text-sm">
//               <MapPin size={14} className="mr-1" />
//               <p>{doctor.address}</p>
//             </div>
//             <div className="flex justify-between items-center mt-2">
//               {renderRating(doctor.rating)}
//               <span className="text-gray-600 text-sm">{doctor.experience} yrs exp</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Render hospital card
//   const HospitalCard = ({ hospital }: { hospital: Hospital }) => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="p-4">
//         <div className="flex items-start">
//           <div className="bg-green-100 p-3 rounded-full mr-3">
//             <Hospital size={24} className="text-green-600" />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-lg">{hospital.name}</h3>
//             <p className="text-green-600 font-medium">{hospital.type}</p>
//             <div className="flex items-center mt-1 text-gray-500 text-sm">
//               <MapPin size={14} className="mr-1" />
//               <p>{hospital.address}</p>
//             </div>
//             <div className="flex justify-between items-center mt-2">
//               {renderRating(hospital.rating)}
//               <span className="text-gray-600 text-sm">{hospital.beds} beds</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {results.doctors.map((doctor, index) => (
//           <DoctorCard key={doctor.id || `doctor-${index}`} doctor={doctor} />
//         ))}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {results.hospitals.map((hospital, index) => (
//           <HospitalCard key={hospital.id || `hospital-${index}`} hospital={hospital} />
//         ))}
//       </div>
//     </div>
//   );
// }
