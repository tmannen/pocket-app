function addTagToSearch(object) {
	document.getElementById("search_form").value += ", "
	document.getElementById("search_form").value += object.innerHTML;
}