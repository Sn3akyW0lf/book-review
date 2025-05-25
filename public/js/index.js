const API_BASE = 'http://localhost:3000/api/v1';

const authToken = localStorage.getItem('authToken') || '';
const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        Authorization: authToken ? authToken : '',
    },
});

const bookListDiv = document.getElementById('book-list');
const bookDetailsDiv = document.getElementById('book-details');
const backToListBtn = document.getElementById('back-to-list');

const bookTitleEl = document.getElementById('title');
const bookAuthorEl = document.getElementById('author');
const bookYearEl = document.getElementById('publish-year');
const bookAvgRatingEl = document.getElementById('book-average-rating');
const bookReviewCountEl = document.getElementById('book-review-count');
const reviewsListEl = document.getElementById('reviews-list');

const reviewForm = document.getElementById('review-form');
const ratingInput = document.getElementById('rating');
const reviewTextInput = document.getElementById('review-text');
const editingReviewIdInput = document.getElementById('editing-review-id');
const reviewFormTitle = document.getElementById('review-form-title');
const cancelEditBtn = document.getElementById('cancel-edit');

const addBookForm = document.getElementById('add-book-form');
const titleInput = document.getElementById('book-title');
const authorInput = document.getElementById('book-author');
const yearInput = document.getElementById('book-year');

let currentBookId = null;

async function loadBooks(page = 1) {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.trim().toLowerCase() || '';

    try {
        bookDetailsDiv.style.display = 'none';
        addBookForm.style.display = 'block';
        bookListDiv.style.display = 'block';
        bookListDiv.innerHTML = '<p>Loading books...</p>';

        const res = await api.get(`/book/get-books`, {
            params: {
                page,
                limit: 10,
                search: searchValue
            }
        });

        if (res.data.books.length === 0) {
            bookListDiv.innerHTML = '<p>No books found.</p>';
            return;
        }

        let html = '<ul class="list-group">';
        res.data.books.forEach(book => {
            html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${book.title}</strong> <i>(${book.publish_year})</i> by ${book.author} <br/>
              Avg Rating: ${book.average_rating ? parseFloat(book.average_rating).toFixed(2) : 'N/A'} |
              Reviews: ${book.review_count || 0}
            </div>
            <button class="btn btn-sm btn-primary" onclick="viewBookDetails(${book.book_id})">View</button>
          </li>
        `;
        });
        html += '</ul>';

        bookListDiv.innerHTML = html;
    } catch (error) {
        bookListDiv.innerHTML = '<p class="text-danger">Failed to load books.</p>';
        console.error(error);
    }
}

async function viewBookDetails(bookId) {
    try {
        currentBookId = bookId;
        bookListDiv.style.display = 'none';
        bookDetailsDiv.style.display = 'block';
        addBookForm.style.display = 'none';
        clearReviewForm();

        const res = await api.get(`/book/get-book/${bookId}`);
        const book = res.data;

        console.log(book.title);

        bookTitleEl.textContent = book.title;
        bookAuthorEl.textContent = book.author;
        bookYearEl.textContent = book.publish_year || 'Unknown';
        bookAvgRatingEl.textContent = book.average_rating ? parseFloat(book.average_rating).toFixed(2) : 'N/A';
        bookReviewCountEl.textContent = book.review_count || book.Reviews.length || 0;

        // Render reviews
        if (book.Reviews.length === 0) {
            reviewsListEl.innerHTML = '<li class="list-group-item">No reviews yet.</li>';
        } else {
            reviewsListEl.innerHTML = '';
            book.Reviews.forEach(review => {
                const isOwner = review.user_id === currentUserId;

                const reviewItem = document.createElement('li');
                reviewItem.className = 'list-group-item';

                reviewItem.innerHTML = `
            <strong>Rating:</strong> ${review.rating} <br/>
            ${review.review_text ? `<em>${review.review_text}</em><br/>` : ''}
            <small>Posted on: ${new Date(review.createdAt).toLocaleDateString()}</small>
            ${isOwner ? `
              <div class="mt-2">
                <button class="btn btn-sm btn-warning me-2" onclick="startEditReview(${review.review_id}, ${review.rating}, \`${escapeHtml(review.review_text)}\`)">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.review_id})">Delete</button>
              </div>
            ` : ''}
          `;
                reviewsListEl.appendChild(reviewItem);
            });
        }
    } catch (error) {
        alert('Failed to load book details.');
        console.error(error);
    }
}

addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const publish_year = yearInput.value.trim();

    if (!title || !author) {
        alert('Title and author are required.');
        return;
    }

    try {
        await api.post('/book/add-book', {
            title,
            author,
            publish_year
        });

        // Clear the form
        addBookForm.reset();

        // Reload the book list
        loadBooks();
    } catch (error) {
        alert(error.response.data.message || 'Failed to add book.');
        console.error(error);
    }
});

function escapeHtml(text = '') {
    return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

document.getElementById('search-btn').addEventListener('click', () => {
    loadBooks();
});


reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rating = parseInt(document.querySelector('input[name="rating"]:checked').value, 10);
    const review_text = reviewTextInput.value.trim();
    const editingReviewId = editingReviewIdInput.value;

    if (rating < 1 || rating > 5) {
        alert('Rating must be between 1 and 5.');
        return;
    }

    try {
        if (editingReviewId) {
            // Edit existing review
            await api.put(`/review/${editingReviewId}`, {
                rating,
                review_text
            });
        } else {
            // Add new review
            await api.post(`/book/get-book/${currentBookId}/reviews`, {
                book_id: currentBookId,
                rating,
                review_text
            });
        }
        await viewBookDetails(currentBookId);
        clearReviewForm();
    } catch (error) {
        alert(error.response.data.message || 'Failed to submit review.');
        console.error(error);
    }
});

cancelEditBtn.addEventListener('click', () => {
    clearReviewForm();
});

function clearReviewForm() {
    const checkedRadio = document.querySelector('input[name="rating"]:checked');
    if (checkedRadio) checkedRadio.checked = false;

    reviewTextInput.value = '';
    editingReviewIdInput.value = '';
    reviewFormTitle.textContent = 'Add a Review';
    cancelEditBtn.style.display = 'none';
}

function startEditReview(reviewId, rating, reviewText) {
    editingReviewIdInput.value = reviewId;
    document.querySelector(`input[name="rating"][value="${rating}"]`).checked = true;
    reviewTextInput.value = reviewText;
    reviewFormTitle.textContent = 'Edit Review';
    cancelEditBtn.style.display = 'inline-block';
}

async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
        await api.delete(`/reviews/${reviewId}`);
        alert('Review deleted successfully.');
        await viewBookDetails(currentBookId);
    } catch (error) {
        alert(error.response.data.message || 'Failed to delete review.');
        console.error(error);
    }
}

// Go back to book list
backToListBtn.addEventListener('click', () => {
    bookDetailsDiv.style.display = 'none';
    addBookForm.style.display = 'block';
    bookListDiv.style.display = 'block';
    clearReviewForm();
});

window.viewBookDetails = viewBookDetails;
window.startEditReview = startEditReview;
window.deleteReview = deleteReview;

// Initial load
loadBooks();