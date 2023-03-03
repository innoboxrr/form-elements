function validateFile(file, rules) {

	console.log(file.type);

	let mimeValidation = rules.validMimes.includes(file.type);

	let sizeValidation = (rules.maxSize == 0 || file.size <= rules.maxSize);

	return mimeValidation && sizeValidation;

}

function getError(file, rules)
{

	let errors = [];

	if(!rules.validMimes.includes(file.type)) errors.push('failMimeValidation');

	if(!(rules.maxSize == 0 || file.size <= rules.maxSize)) errors.push('failMaxSizeValidation');
	
	return errors;

}

function getPreview(file)
{

	if(['image/gif', 'image/jpeg', 'image/png',].includes(file.type)) return URL.createObjectURL(file);

	return 'https://icon-library.com/images/file-icon/file-icon-15.jpg';

}

const validateFiles = (files = [], rules) => {

	return new Promise(function(resolve, reject) {

		files.map(file => Object.assign(file, {
            preview: getPreview(file),
            uploaded: false,
            validation: validateFile(file, rules),
            errors: getError(file, rules),
            path: undefined,
            id: undefined
        }));

		resolve(files);

	});

}

function isVideo(file) {
	
	var a = file.type.match('video.*');

	if (a) {

		return true;

	} else {

		return false;

	}

}

function isImage(file) {
	
	var a = file.type.match('image.*');

	if (a) {

		return true;

	} else {

		return false;

	}

}

function sizeParser(value) {

	let bytes = value;
		
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	
	if (bytes == 0) return '0 Byte';
	
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];

}

export { 
	validateFiles,
	isVideo,
	isImage,
	sizeParser
};