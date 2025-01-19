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

class ImageProcessor {
	private imageData: Uint8Array;
	private width: number;
	private height: number;
	private grayscaleData: Uint8Array;
	private gradientMagnitude: number[];
	private gradientDirection: number[];
 
	constructor(imageData: Uint8Array, width: number, height: number) {
	  this.imageData = imageData;
	  this.width = width;
	  this.height = height;
	  this.grayscaleData = new Uint8Array(width * height);
	  this.gradientMagnitude = new Array(width * height);
	  this.gradientDirection = new Array(width * height);
	}
 
	toGrayscale(): void {
	  for (let i = 0; i < this.height; i++) {
		 for (let j = 0; j < this.width; j++) {
			const idx = (i * this.width + j) * 4;
			const r = this.imageData[idx];
			const g = this.imageData[idx + 1];
			const b = this.imageData[idx + 2];
			this.grayscaleData[i * this.width + j] = 
			  Math.round(0.299 * r + 0.587 * g + 0.114 * b);
		 }
	  }
	}
 
	gaussianBlur(sigma: number = 1.4): void {
	  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
	  const kernel = this.generateGaussianKernel(kernelSize, sigma);
	  const tempData = new Uint8Array(this.width * this.height);
 
	  // Horizontal pass
	  for (let i = 0; i < this.height; i++) {
		 for (let j = 0; j < this.width; j++) {
			let sum = 0;
			let weightSum = 0;
			
			for (let k = -Math.floor(kernelSize/2); k <= Math.floor(kernelSize/2); k++) {
			  if (j + k >= 0 && j + k < this.width) {
				 const weight = kernel[k + Math.floor(kernelSize/2)];
				 sum += this.grayscaleData[i * this.width + (j + k)] * weight;
				 weightSum += weight;
			  }
			}
			
			tempData[i * this.width + j] = Math.round(sum / weightSum);
		 }
	  }
 
	  // Vertical pass
	  for (let i = 0; i < this.height; i++) {
		 for (let j = 0; j < this.width; j++) {
			let sum = 0;
			let weightSum = 0;
			
			for (let k = -Math.floor(kernelSize/2); k <= Math.floor(kernelSize/2); k++) {
			  if (i + k >= 0 && i + k < this.height) {
				 const weight = kernel[k + Math.floor(kernelSize/2)];
				 sum += tempData[(i + k) * this.width + j] * weight;
				 weightSum += weight;
			  }
			}
			
			this.grayscaleData[i * this.width + j] = Math.round(sum / weightSum);
		 }
	  }
	}
 
	private generateGaussianKernel(size: number, sigma: number): number[] {
	  const kernel = new Array(size);
	  const center = Math.floor(size/2);
	  
	  for (let i = 0; i < size; i++) {
		 const x = i - center;
		 kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
	  }
	  
	  return kernel;
	}
 
	computeGradients(): void {
	  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
	  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
 
	  for (let i = 1; i < this.height - 1; i++) {
		 for (let j = 1; j < this.width - 1; j++) {
			let gx = 0;
			let gy = 0;
 
			for (let ki = -1; ki <= 1; ki++) {
			  for (let kj = -1; kj <= 1; kj++) {
				 const val = this.grayscaleData[(i + ki) * this.width + (j + kj)];
				 gx += val * sobelX[ki + 1][kj + 1];
				 gy += val * sobelY[ki + 1][kj + 1];
			  }
			}
 
			const idx = i * this.width + j;
			this.gradientMagnitude[idx] = Math.sqrt(gx * gx + gy * gy);
			this.gradientDirection[idx] = Math.atan2(gy, gx);
		 }
	  }
	}
 
	nonMaximumSuppression(): number[] {
	  const result = new Array(this.width * this.height).fill(0);
 
	  for (let i = 1; i < this.height - 1; i++) {
		 for (let j = 1; j < this.width - 1; j++) {
			const idx = i * this.width + j;
			const angle = this.gradientDirection[idx] * 180 / Math.PI;
			const magnitude = this.gradientMagnitude[idx];
 
			const roundedAngle = Math.round(angle / 45) * 45;
			let neighbor1: number, neighbor2: number;
 
			switch (((roundedAngle + 360) % 360)) {
			  case 0:
				 neighbor1 = this.gradientMagnitude[idx - 1];
				 neighbor2 = this.gradientMagnitude[idx + 1];
				 break;
			  case 45:
				 neighbor1 = this.gradientMagnitude[(i - 1) * this.width + (j + 1)];
				 neighbor2 = this.gradientMagnitude[(i + 1) * this.width + (j - 1)];
				 break;
			  case 90:
				 neighbor1 = this.gradientMagnitude[(i - 1) * this.width + j];
				 neighbor2 = this.gradientMagnitude[(i + 1) * this.width + j];
				 break;
			  case 135:
				 neighbor1 = this.gradientMagnitude[(i - 1) * this.width + (j - 1)];
				 neighbor2 = this.gradientMagnitude[(i + 1) * this.width + (j + 1)];
				 break;
			  default:
				 neighbor1 = 0;
				 neighbor2 = 0;
			}
 
			if (magnitude >= neighbor1 && magnitude >= neighbor2) {
			  result[idx] = magnitude;
			}
		 }
	  }
 
	  return result;
	}
 
	doubleThreshold(lowThreshold: number, highThreshold: number): Uint8Array {
	  const result = new Uint8Array(this.width * this.height);
	  const suppressedEdges = this.nonMaximumSuppression();
	  const strong = 255;
	  const weak = 128;
 
	  for (let i = 0; i < this.height; i++) {
		 for (let j = 0; j < this.width; j++) {
			const idx = i * this.width + j;
			const magnitude = suppressedEdges[idx];
 
			if (magnitude >= highThreshold) {
			  result[idx] = strong;
			} else if (magnitude >= lowThreshold) {
			  result[idx] = weak;
			}
		 }
	  }
 
	  return result;
	}
 
	hysteresis(thresholdResult: Uint8Array): Uint8Array {
	  const final = new Uint8Array(this.width * this.height);
	  const strong = 255;
	  const weak = 128;
 
	  // First pass: mark strong edges
	  for (let i = 0; i < this.height; i++) {
		 for (let j = 0; j < this.width; j++) {
			const idx = i * this.width + j;
			if (thresholdResult[idx] === strong) {
			  final[idx] = strong;
			}
		 }
	  }
 
	  // Second pass: check weak edges
	  let edgeFound: boolean;
	  do {
		 edgeFound = false;
		 for (let i = 1; i < this.height - 1; i++) {
			for (let j = 1; j < this.width - 1; j++) {
			  const idx = i * this.width + j;
			  if (thresholdResult[idx] === weak && !final[idx]) {
				 // Check 8-connected neighbors
				 for (let ni = -1; ni <= 1; ni++) {
					for (let nj = -1; nj <= 1; nj++) {
					  if (final[(i + ni) * this.width + (j + nj)] === strong) {
						 final[idx] = strong;
						 edgeFound = true;
						 break;
					  }
					}
					if (final[idx] === strong) break;
				 }
			  }
			}
		 }
	  } while (edgeFound);
 
	  return final;
	}
 }
 
 // Main edge detection function
 export const detectEdges = async (
	imageData: Uint8Array,
	width: number,
	height: number,
	options: {
	  gaussianSigma?: number;
	  lowThreshold?: number;
	  highThreshold?: number;
	}
 ): Promise<Uint8Array> => {
	const {
	  gaussianSigma = 1.4,
	  lowThreshold = 20,
	  highThreshold = 40,
	} = options;
 
	const processor = new ImageProcessor(imageData, width, height);
 
	// Step 1: Convert to grayscale
	processor.toGrayscale();
 
	// Step 2: Apply Gaussian blur
	processor.gaussianBlur(gaussianSigma);
 
	// Step 3: Compute gradients
	processor.computeGradients();
 
	// Step 4 & 5: Apply double threshold
	const thresholdResult = processor.doubleThreshold(lowThreshold, highThreshold);
 
	// Step 6: Edge tracking by hysteresis
	const finalResult = processor.hysteresis(thresholdResult);
 
	return finalResult;
 };


