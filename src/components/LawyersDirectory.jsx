import React, { useState, useEffect } from 'react';

const LawyersDirectory = () => {
  const lawyers = [
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@legalaid.com',
      phone: '+1 (555) 123-4567',
      specializations: ['workplace-harassment', 'sexual-harassment', 'discrimination'],
      experience: 15,
      rating: 4.9,
      casesHandled: 250,
      successRate: 92,
      availability: 'available',
      bio: 'Dedicated employment law attorney with over 15 years of experience advocating for victims of workplace harassment.',
      languages: ['English', 'Spanish'],
      location: { city: 'New York', state: 'NY' }
    },
    {
      name: 'James Chen',
      email: 'james.chen@employmentlaw.com',
      phone: '+1 (555) 234-5678',
      specializations: ['employment-law', 'discrimination', 'labor-law'],
      experience: 12,
      rating: 4.8,
      casesHandled: 180,
      successRate: 89,
      availability: 'available',
      bio: 'Experienced employment attorney specializing in discrimination and wrongful termination cases.',
      languages: ['English', 'Mandarin'],
      location: { city: 'San Francisco', state: 'CA' }
    },
    {
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@civilrights.org',
      phone: '+1 (555) 345-6789',
      specializations: ['sexual-harassment', 'civil-rights', 'discrimination'],
      experience: 18,
      rating: 4.9,
      casesHandled: 320,
      successRate: 94,
      availability: 'available',
      bio: 'Award-winning civil rights attorney with a proven track record in sexual harassment cases.',
      languages: ['English', 'Spanish', 'Portuguese'],
      location: { city: 'Miami', state: 'FL' }
    },
    {
      name: 'David Thompson',
      email: 'david.thompson@laborlaw.com',
      phone: '+1 (555) 456-7890',
      specializations: ['labor-law', 'employment-law', 'workplace-harassment'],
      experience: 10,
      rating: 4.7,
      casesHandled: 150,
      successRate: 87,
      availability: 'available',
      bio: 'Labor law specialist focusing on wage disputes and workers compensation.',
      languages: ['English'],
      location: { city: 'Chicago', state: 'IL' }
    },
    {
      name: 'Emily Patel',
      email: 'emily.patel@workplacelaw.com',
      phone: '+1 (555) 567-8901',
      specializations: ['workplace-harassment', 'employment-law', 'discrimination'],
      experience: 14,
      rating: 4.8,
      casesHandled: 200,
      successRate: 90,
      availability: 'available',
      bio: 'Compassionate attorney specializing in workplace harassment and retaliation cases.',
      languages: ['English', 'Hindi', 'Gujarati'],
      location: { city: 'Los Angeles', state: 'CA' }
    },
    {
      name: 'Michael O\'Brien',
      email: 'michael.obrien@employmentrights.com',
      phone: '+1 (555) 678-9012',
      specializations: ['discrimination', 'civil-rights', 'employment-law'],
      experience: 20,
      rating: 4.9,
      casesHandled: 400,
      successRate: 93,
      availability: 'available',
      bio: 'Senior partner with two decades of experience in employment discrimination cases.',
      languages: ['English', 'French'],
      location: { city: 'Boston', state: 'MA' }
    },
    {
      name: 'Amanda Johnson',
      email: 'amanda.johnson@justicelaw.com',
      phone: '+1 (555) 789-0123',
      specializations: ['sexual-harassment', 'workplace-harassment', 'retaliation'],
      experience: 16,
      rating: 4.9,
      casesHandled: 280,
      successRate: 91,
      availability: 'available',
      bio: 'Fierce advocate for harassment victims with extensive trial experience.',
      languages: ['English'],
      location: { city: 'Philadelphia', state: 'PA' }
    },
    {
      name: 'Robert Kim',
      email: 'robert.kim@workersrights.org',
      phone: '+1 (555) 890-1234',
      specializations: ['wrongful-termination', 'discrimination', 'employment-law'],
      experience: 13,
      rating: 4.7,
      casesHandled: 190,
      successRate: 88,
      availability: 'available',
      bio: 'Skilled litigator specializing in wrongful termination and discrimination cases.',
      languages: ['English', 'Korean'],
      location: { city: 'Seattle', state: 'WA' }
    },
    {
      name: 'Jessica Martinez',
      email: 'jessica.martinez@civiladvocates.com',
      phone: '+1 (555) 901-2345',
      specializations: ['civil-rights', 'discrimination', 'workplace-harassment'],
      experience: 11,
      rating: 4.8,
      casesHandled: 165,
      successRate: 89,
      availability: 'available',
      bio: 'Passionate civil rights attorney committed to fighting workplace discrimination.',
      languages: ['English', 'Spanish'],
      location: { city: 'Austin', state: 'TX' }
    },
    {
      name: 'Daniel Washington',
      email: 'daniel.washington@employmentdefense.com',
      phone: '+1 (555) 012-3456',
      specializations: ['retaliation', 'wrongful-termination', 'employment-law'],
      experience: 17,
      rating: 4.8,
      casesHandled: 310,
      successRate: 90,
      availability: 'available',
      bio: 'Veteran employment attorney with deep expertise in retaliation and whistleblower cases.',
      languages: ['English'],
      location: { city: 'Washington', state: 'DC' }
    },
    {
      name: 'Lisa Nguyen',
      email: 'lisa.nguyen@workplaceequity.com',
      phone: '+1 (555) 123-4568',
      specializations: ['wage-dispute', 'labor-law', 'employment-law'],
      experience: 9,
      rating: 4.6,
      casesHandled: 140,
      successRate: 85,
      availability: 'available',
      bio: 'Dedicated labor attorney focusing on wage theft and overtime violations.',
      languages: ['English', 'Vietnamese'],
      location: { city: 'San Diego', state: 'CA' }
    },
    {
      name: 'Christopher Brown',
      email: 'chris.brown@equalrights.org',
      phone: '+1 (555) 234-5679',
      specializations: ['discrimination', 'sexual-harassment', 'civil-rights'],
      experience: 19,
      rating: 4.9,
      casesHandled: 360,
      successRate: 92,
      availability: 'available',
      bio: 'Highly experienced civil rights advocate with nearly two decades fighting discrimination.',
      languages: ['English', 'German'],
      location: { city: 'Atlanta', state: 'GA' }
    },
    {
      name: 'Rachel Cohen',
      email: 'rachel.cohen@laborjustice.com',
      phone: '+1 (555) 345-6780',
      specializations: ['workplace-harassment', 'retaliation', 'employment-law'],
      experience: 8,
      rating: 4.7,
      casesHandled: 125,
      successRate: 86,
      availability: 'available',
      bio: 'Rising star in employment law with a focus on creating safe workplaces.',
      languages: ['English', 'Hebrew'],
      location: { city: 'Minneapolis', state: 'MN' }
    },
    {
      name: 'Anthony Garcia',
      email: 'anthony.garcia@workersadvocacy.com',
      phone: '+1 (555) 456-7891',
      specializations: ['wrongful-termination', 'wage-dispute', 'labor-law'],
      experience: 15,
      rating: 4.8,
      casesHandled: 240,
      successRate: 89,
      availability: 'available',
      bio: 'Passionate workers advocate specializing in wrongful termination and wage disputes.',
      languages: ['English', 'Spanish'],
      location: { city: 'Phoenix', state: 'AZ' }
    },
    {
      name: 'Sophia Anderson',
      email: 'sophia.anderson@equalitylaw.com',
      phone: '+1 (555) 567-8902',
      specializations: ['sexual-harassment', 'discrimination', 'civil-rights'],
      experience: 12,
      rating: 4.8,
      casesHandled: 195,
      successRate: 90,
      availability: 'available',
      bio: 'Determined advocate for victims of sexual harassment and discrimination.',
      languages: ['English'],
      location: { city: 'Nashville', state: 'TN' }
    },
    {
      name: 'Kevin Lewis',
      email: 'kevin.lewis@employmentjustice.org',
      phone: '+1 (555) 678-9013',
      specializations: ['retaliation', 'whistleblower', 'employment-law'],
      experience: 14,
      rating: 4.9,
      casesHandled: 220,
      successRate: 91,
      availability: 'available',
      bio: 'Expert in whistleblower and retaliation cases with numerous successful outcomes.',
      languages: ['English', 'Italian'],
      location: { city: 'Denver', state: 'CO' }
    },
    {
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@civilrightscenter.com',
      phone: '+1 (555) 789-0124',
      specializations: ['discrimination', 'workplace-harassment', 'employment-law'],
      experience: 11,
      rating: 4.7,
      casesHandled: 170,
      successRate: 87,
      availability: 'available',
      bio: 'Skilled mediator and litigator in employment discrimination cases.',
      languages: ['English'],
      location: { city: 'Portland', state: 'OR' }
    },
    {
      name: 'William Harris',
      email: 'william.harris@labordefense.com',
      phone: '+1 (555) 890-1235',
      specializations: ['wage-dispute', 'wrongful-termination', 'labor-law'],
      experience: 16,
      rating: 4.8,
      casesHandled: 275,
      successRate: 90,
      availability: 'available',
      bio: 'Veteran labor attorney with extensive class action experience.',
      languages: ['English'],
      location: { city: 'Detroit', state: 'MI' }
    },
    {
      name: 'Nicole Williams',
      email: 'nicole.williams@harassmentlaw.com',
      phone: '+1 (555) 901-2346',
      specializations: ['sexual-harassment', 'workplace-harassment', 'retaliation'],
      experience: 13,
      rating: 4.9,
      casesHandled: 210,
      successRate: 92,
      availability: 'available',
      bio: 'Compassionate yet aggressive representation for harassment victims.',
      languages: ['English', 'French'],
      location: { city: 'New York', state: 'NY' }
    },
    {
      name: 'Thomas Jackson',
      email: 'thomas.jackson@employeeadvocates.org',
      phone: '+1 (555) 012-3457',
      specializations: ['discrimination', 'civil-rights', 'wrongful-termination'],
      experience: 21,
      rating: 4.9,
      casesHandled: 450,
      successRate: 94,
      availability: 'available',
      bio: 'Distinguished employment attorney with over two decades of experience.',
      languages: ['English', 'Spanish'],
      location: { city: 'Charlotte', state: 'NC' }
    }
  ];

  const [filteredLawyers, setFilteredLawyers] = useState(lawyers);
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    minRating: '',
    search: ''
  });

  const formatSpecialization = (spec) => {
    return spec.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const uniqueSpecializations = [...new Set(
    lawyers.flatMap(lawyer => lawyer.specializations)
  )].sort();

  const uniqueCities = [...new Set(
    lawyers.map(lawyer => lawyer.location.city)
  )].sort();

  useEffect(() => {
    const filtered = lawyers.filter(lawyer => {
      const matchSpec = !filters.specialization || 
        lawyer.specializations.includes(filters.specialization);
      const matchCity = !filters.city || 
        lawyer.location.city === filters.city;
      const matchRating = !filters.minRating || 
        lawyer.rating >= parseFloat(filters.minRating);
      const matchSearch = !filters.search || 
        lawyer.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchSpec && matchCity && matchRating && matchSearch;
    });
    setFilteredLawyers(filtered);
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleContact = (lawyer) => {
    alert(`Contact: ${lawyer.email}\nPhone: ${lawyer.phone}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Legal Aid Lawyers Directory
        </h1>

        {/* Stats Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Our Network</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">20</div>
              <div className="text-gray-600 text-sm">Expert Lawyers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">15</div>
              <div className="text-gray-600 text-sm">Cities Covered</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">4.8</div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">90%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
              >
                <option value="">All Specializations</option>
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>
                    {formatSpecialization(spec)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Rating
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input 
                type="text"
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2"></div>
              
              <div className="p-6">
                {/* Availability Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{lawyer.name}</h3>
                    <p className="text-sm text-gray-600">
                      {lawyer.location.city}, {lawyer.location.state}
                    </p>
                  </div>
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Available
                  </span>
                </div>

                {/* Rating and Experience */}
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-400 text-gray-800 text-sm font-bold px-2 py-1 rounded">
                    ★ {lawyer.rating}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {lawyer.experience} years experience
                  </span>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {lawyer.specializations.map((spec, idx) => (
                      <span 
                        key={idx}
                        className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                      >
                        {formatSpecialization(spec)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {lawyer.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Cases Handled</div>
                    <div className="text-lg font-bold text-gray-800">{lawyer.casesHandled}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Success Rate</div>
                    <div className="text-lg font-bold text-gray-800">{lawyer.successRate}%</div>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">
                    <strong>Languages:</strong> {lawyer.languages.join(', ')}
                  </span>
                </div>

                {/* Contact Button */}
                <button 
                  onClick={() => handleContact(lawyer)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition duration-300"
                >
                  Contact Lawyer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredLawyers.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              No lawyers found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyersDirectory;