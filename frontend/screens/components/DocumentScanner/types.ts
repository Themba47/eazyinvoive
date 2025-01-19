// Types for our edge detection options and results
interface EdgeDetectionOptions {
	gaussianSigma?: number;
	lowThreshold?: number;
	highThreshold?: number;
 }
 
 export interface ProcessedImage {
	width: number;
	height: number;
	edges: Uint8Array;
 }
 
 // Image processor class
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
 
	// ... rest of the ImageProcessor methods remain the same ...
 }