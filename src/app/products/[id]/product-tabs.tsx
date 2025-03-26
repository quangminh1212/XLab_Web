'use client';

import { useEffect } from 'react';

export function ProductTabsInit() {
    useEffect(() => {
        // Chức năng chuyển đổi tab
        const initTabs = () => {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    // Xóa trạng thái active từ tất cả tab
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Thêm trạng thái active cho tab đang chọn
                    button.classList.add('active');
                    if (tabContents[index]) {
                        tabContents[index].classList.add('active');
                    }
                });
            });

            // Xử lý hiển thị/ẩn câu trả lời trong FAQ
            const faqQuestions = document.querySelectorAll('.faq-question');

            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const toggle = question.querySelector('.faq-toggle');

                    if (answer && answer.classList.contains('active')) {
                        answer.classList.remove('active');
                        if (toggle) {
                            toggle.textContent = '+';
                        }
                    } else if (answer) {
                        answer.classList.add('active');
                        if (toggle) {
                            toggle.textContent = '-';
                        }
                    }
                });
            });

            // Xử lý đánh giá sao
            const ratingInputs = document.querySelectorAll('.rating-input .star-btn');
            ratingInputs.forEach((star, index) => {
                star.addEventListener('click', () => {
                    // Xóa active từ tất cả sao
                    ratingInputs.forEach(s => s.classList.remove('active'));
                    // Thêm active cho sao được chọn và các sao trước đó
                    for (let i = 0; i <= index; i++) {
                        ratingInputs[i].classList.add('active');
                    }
                });
            });

            // Xử lý nút like đánh giá
            const likeButtons = document.querySelectorAll('.btn-like');
            likeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const countElement = button.querySelector('.count');
                    if (countElement) {
                        const currentCount = parseInt(countElement.textContent || '0');
                        countElement.textContent = (currentCount + 1).toString();
                        button.classList.add('liked');
                    }
                });
            });

            // Xử lý nút trả lời đánh giá
            const replyButtons = document.querySelectorAll('.btn-reply');
            replyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const reviewItem = button.closest('.review-item');
                    if (reviewItem) {
                        const replyForm = document.createElement('div');
                        replyForm.className = 'review-reply-form';
                        replyForm.innerHTML = `
                            <div class="form-group">
                                <label>Nội dung trả lời</label>
                                <textarea rows="3" placeholder="Nhập nội dung trả lời..."></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-primary submit-reply">Gửi trả lời</button>
                                <button type="button" class="btn btn-light cancel-reply">Hủy</button>
                            </div>
                        `;

                        // Thêm form trả lời vào sau nút trả lời
                        button.parentElement?.insertBefore(replyForm, button);

                        // Xử lý nút gửi trả lời
                        const submitButton = replyForm.querySelector('.submit-reply');
                        submitButton?.addEventListener('click', () => {
                            const textarea = replyForm.querySelector('textarea');
                            if (textarea && textarea.value.trim()) {
                                // Thêm trả lời mới vào danh sách
                                const newReply = document.createElement('div');
                                newReply.className = 'review-reply';
                                newReply.innerHTML = `
                                    <div class="reply-header">
                                        <div class="reply-user">
                                            <img src="/images/avatars/current-user.jpg" alt="Bạn" class="user-avatar" />
                                            <div class="user-info">
                                                <span class="user-name">Bạn</span>
                                            </div>
                                        </div>
                                        <span class="reply-date">${new Date().toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div class="reply-content">
                                        <p>${textarea.value.trim()}</p>
                                        <div class="reply-actions">
                                            <button class="btn-like">
                                                <span class="icon">👍</span>
                                                <span class="count">0</span>
                                            </button>
                                        </div>
                                    </div>
                                `;

                                // Thêm trả lời mới vào trước form
                                reviewItem.insertBefore(newReply, replyForm);

                                // Xóa form trả lời
                                replyForm.remove();

                                // Thêm xử lý like cho trả lời mới
                                const newLikeButton = newReply.querySelector('.btn-like');
                                newLikeButton?.addEventListener('click', () => {
                                    const countElement = newLikeButton.querySelector('.count');
                                    if (countElement) {
                                        const currentCount = parseInt(countElement.textContent || '0');
                                        countElement.textContent = (currentCount + 1).toString();
                                        newLikeButton.classList.add('liked');
                                    }
                                });
                            }
                        });

                        // Xử lý nút hủy
                        const cancelButton = replyForm.querySelector('.cancel-reply');
                        cancelButton?.addEventListener('click', () => {
                            replyForm.remove();
                        });
                    }
                });
            });
        };

        // Khởi tạo các sự kiện DOM sau khi component được render
        initTabs();

        // Cleanup event listeners khi component unmount
        return () => {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const faqQuestions = document.querySelectorAll('.faq-question');
            const ratingInputs = document.querySelectorAll('.rating-input .star-btn');
            const likeButtons = document.querySelectorAll('.btn-like');
            const replyButtons = document.querySelectorAll('.btn-reply');

            tabButtons.forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });

            faqQuestions.forEach(question => {
                question.replaceWith(question.cloneNode(true));
            });

            ratingInputs.forEach(star => {
                star.replaceWith(star.cloneNode(true));
            });

            likeButtons.forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });

            replyButtons.forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });
        };
    }, []);

    return null; // Component này chỉ xử lý DOM, không render bất kỳ nội dung nào
} 