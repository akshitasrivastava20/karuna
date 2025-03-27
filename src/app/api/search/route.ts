// import { NextRequest, NextResponse } from 'next/server';
// import path from 'path';
// import fs from 'fs';
// import { parse } from 'csv-parse/sync';

// // Define types
// type Doctor = {
//   id: string;
//   name: string;
//   specialization: string;
//   hospital: string;
//   address: string;
//   rating: number;
//   experience: number;
//   image?: string;
// };

// type Hospital = {
//   id: string;
//   name: string;
//   address: string;
//   type: string;
//   beds: number;
//   rating: number;
//   image?: string;
//   specialties: string[];
// };

// type SearchResult = {
//   doctors: Doctor[];
//   hospitals: Hospital[];
// };

// // Helper function to read and parse CSV data
// function readCsvData(type: 'doctors' | 'hospitals'): Doctor[] | Hospital[] {
//   try {
//     const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
//     const fileContent = fs.readFileSync(filePath, 'utf8');
    
//     return parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true
//     });
//   } catch (error) {
//     console.error(`Error reading ${type} data:`, error);
//     return [];
//   }
// }

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const query = searchParams.get('query')?.toLowerCase() || '';
//   const filter = searchParams.get('filter') || 'all';
  
//   let doctors: Doctor[] = [];
//   let hospitals: Hospital[] = [];
  
//   // Load data based on filter
//   if (filter === 'all' || filter === 'doctors') {
//     doctors = readCsvData('doctors') as Doctor[];
    
//     if (query) {
//       doctors = doctors.filter(doctor => 
//         doctor.name.toLowerCase().includes(query) || 
//         doctor.specialization.toLowerCase().includes(query) ||
//         doctor.hospital.toLowerCase().includes(query) ||
//         doctor.address.toLowerCase().includes(query)
//       );
//     }
//   }
  
//   if (filter === 'all' || filter === 'hospitals') {
//     hospitals = readCsvData('hospitals') as Hospital[];
    
//     if (query) {
//       hospitals = hospitals.filter(hospital => 
//         hospital.name.toLowerCase().includes(query) || 
//         hospital.address.toLowerCase().includes(query) ||
//         hospital.type.toLowerCase().includes(query) ||
//         hospital.specialties.some(specialty => 
//           specialty.toLowerCase().includes(query)
//         )
//       );
//     }
//   }
  
//   const results: SearchResult = {
//     doctors,
//     hospitals
//   };
  
//   return NextResponse.json(results);
// }
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

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

// Helper function to read and parse CSV data
function readCsvData<T extends { id?: string }>(type: 'doctors' | 'hospitals'): T[] {
  try {
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const records: T[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Ensure unique IDs
    return records.map((record) => ({
      ...record,
      id: record.id || uuidv4(), // Generate a unique ID if missing
    }));
  } catch (error) {
    console.error(`Error reading ${type} data:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase() || '';
  const filter = searchParams.get('filter') || 'all';

  let doctors: Doctor[] = [];
  let hospitals: Hospital[] = [];

  // Load data based on filter
  if (filter === 'all' || filter === 'doctors') {
    doctors = readCsvData<Doctor>('doctors');

    if (query) {
      doctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query) ||
        doctor.address.toLowerCase().includes(query)
      );
    }
  }

  if (filter === 'all' || filter === 'hospitals') {
    hospitals = readCsvData<Hospital>('hospitals');

    if (query) {
      hospitals = hospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.address.toLowerCase().includes(query) ||
        hospital.type.toLowerCase().includes(query) ||
        hospital.specialties.some((specialty) =>
          specialty.toLowerCase().includes(query)
        )
      );
    }
  }

  const results = { doctors, hospitals };

  return NextResponse.json(results);
}
