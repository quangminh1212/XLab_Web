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
        };

        // Khởi tạo các sự kiện DOM sau khi component được render
        initTabs();

        // Cleanup event listeners khi component unmount
        return () => {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const faqQuestions = document.querySelectorAll('.faq-question');

            tabButtons.forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });

            faqQuestions.forEach(question => {
                question.replaceWith(question.cloneNode(true));
            });
        };
    }, []);

    return null; // Component này chỉ xử lý DOM, không render bất kỳ nội dung nào
} 