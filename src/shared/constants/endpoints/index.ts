import authEndpoints from "./authEndpoints";
import categoryEndpoints from "./categoryEndpoints";
import { productEndpoints } from "./productEndpoints";

const ENDPOINTS = {
	product: productEndpoints,
	category: categoryEndpoints,
	auth: authEndpoints
}

export default ENDPOINTS;
