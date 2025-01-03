export function backendApp() {
	// return 'http://127.0.0.1:8083/'
	return 'http://192.168.1.105:8083'
}

export const getPaperSize = (paperSize: string): [number, number] => {
	const sizes: Record<string, [number, number]> = {
	  A4: [595.28, 841.89], // 8.27 x 11.69 inches
	  Letter: [612, 792], // 8.5 x 11 inches
	  Legal: [612, 1008], // 8.5 x 14 inches
	  Tabloid: [792, 1224], // 11 x 17 inches
	  Executive: [522, 756], // 7.25 x 10.5 inches
	};
 
	return sizes[paperSize] || sizes['A4']; // Default to A4 if size is not found
 };
 

export function industryType() {
	return [
		{ label: "Agriculture", value: "Agriculture" },
		{ label: "Forestry", value: "Forestry" },
		{ label: "Fishing", value: "Fishing" },
		{ label: "Mining and Quarrying", value: "Mining and Quarrying" },
		{ label: "Food and Beverage", value: "Food and Beverage" },
		{ label: "Textiles and Apparel", value: "Textiles and Apparel" },
		{ label: "Chemicals and Pharmaceuticals", value: "Chemicals and Pharmaceuticals" },
		{ label: "Automotive", value: "Automotive" },
		{ label: "Electronics and Electrical Equipment", value: "Electronics and Electrical Equipment" },
		{ label: "Machinery and Equipment", value: "Machinery and Equipment" },
		{ label: "Paper and Packaging", value: "Paper and Packaging" },
		{ label: "Plastics and Rubber", value: "Plastics and Rubber" },
		{ label: "Furniture and Fixtures", value: "Furniture and Fixtures" },
		{ label: "Residential Construction", value: "Residential Construction" },
		{ label: "Commercial Construction", value: "Commercial Construction" },
		{ label: "Civil Engineering (Infrastructure)", value: "Civil Engineering (Infrastructure)" },
		{ label: "Real Estate Development", value: "Real Estate Development" },
		{ label: "Property Management", value: "Property Management" },
		{ label: "Software Development", value: "Software Development" },
		{ label: "IT Services", value: "IT Services" },
		{ label: "Hardware Manufacturing", value: "Hardware Manufacturing" },
		{ label: "Telecommunications", value: "Telecommunications" },
		{ label: "Data Analytics and AI", value: "Data Analytics and AI" },
		{ label: "Banking", value: "Banking" },
		{ label: "Investment Services", value: "Investment Services" },
		{ label: "Insurance", value: "Insurance" },
		{ label: "FinTech", value: "FinTech" },
		{ label: "Hospitals and Clinics", value: "Hospitals and Clinics" },
		{ label: "Pharmaceuticals", value: "Pharmaceuticals" },
		{ label: "Medical Devices", value: "Medical Devices" },
		{ label: "Biotechnology", value: "Biotechnology" },
		{ label: "Oil and Gas", value: "Oil and Gas" },
		{ label: "Renewable Energy", value: "Renewable Energy" },
		{ label: "Electricity Distribution", value: "Electricity Distribution" },
		{ label: "Water Utilities", value: "Water Utilities" },
		{ label: "Aviation", value: "Aviation" },
		{ label: "Shipping and Ports", value: "Shipping and Ports" },
		{ label: "Rail Transport", value: "Rail Transport" },
		{ label: "Road Freight", value: "Road Freight" },
		{ label: "Warehousing", value: "Warehousing" },
		{ label: "E-commerce", value: "E-commerce" },
		{ label: "Supermarkets and Groceries", value: "Supermarkets and Groceries" },
		{ label: "Fashion Retail", value: "Fashion Retail" },
		{ label: "Consumer Electronics", value: "Consumer Electronics" },
		{ label: "Film and Television", value: "Film and Television" },
		{ label: "Publishing", value: "Publishing" },
		{ label: "Gaming", value: "Gaming" },
		{ label: "Music Industry", value: "Music Industry" },
		{ label: "Digital Media", value: "Digital Media" },
		{ label: "Hotels and Resorts", value: "Hotels and Resorts" },
		{ label: "Travel Agencies", value: "Travel Agencies" },
		{ label: "Event Planning", value: "Event Planning" },
		{ label: "Food and Beverage Services", value: "Food and Beverage Services" },
		{ label: "Primary and Secondary Education", value: "Primary and Secondary Education" },
		{ label: "Higher Education", value: "Higher Education" },
		{ label: "Corporate Training", value: "Corporate Training" },
		{ label: "EdTech", value: "EdTech" },
		{ label: "Public Administration", value: "Public Administration" },
		{ label: "Defense and Security", value: "Defense and Security" },
		{ label: "Social Services", value: "Social Services" },
		{ label: "Environmental Consulting", value: "Environmental Consulting" },
		{ label: "Waste Management", value: "Waste Management" },
		{ label: "NGOs and Nonprofits", value: "NGOs and Nonprofits" },
		{ label: "Legal Services", value: "Legal Services" },
		{ label: "Accounting and Auditing", value: "Accounting and Auditing" },
		{ label: "Consulting Services", value: "Consulting Services" },
		{ label: "Architecture and Engineering", value: "Architecture and Engineering" },
		{ label: "Aerospace", value: "Aerospace" },
		{ label: "Robotics", value: "Robotics" },
		{ label: "Nanotechnology", value: "Nanotechnology" },
		{ label: "Space Exploration", value: "Space Exploration" },
		{ label: "Cryptocurrency and Blockchain", value: "Cryptocurrency and Blockchain" },
		{ label: "Other", value: "Other" }
	 ];	 
}

