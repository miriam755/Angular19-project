import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-welcome-animation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome-animation.component.html',
    styleUrl: './welcome-animation.component.css',
})
export class WelcomeAnimationComponent implements OnInit {
    isVisible = false; // דגל לשליטה על видимость האנימציה
    isHiding = false; // דגל שיכול לשמש להוספת סגנונות הסתרה ספציפיים (כרגע לא בשימוש ישיר)

    ngOnInit() {
        // לאחר השהיה קצרה, הצג את האנימציה על ידי שינוי isVisible ל-true
        setTimeout(() => {
            this.isVisible = true; // הוספת הקלאס 'show' ל-HTML תגרום לאנימציה להתחיל
        }, 100); // השהיה של 100 מילישניות כדי לאפשר לדף להיטען לפני האנימציה

        // לאחר 3 שניות, התחל את תהליך ההסתרה
        setTimeout(() => {
            this.isVisible = false; // הסרת הקלאס 'show'
            this.isHiding = true; // הוספת הקלאס 'hide' תתחיל את אנימציית היציאה
        }, 3000); // האנימציה תישאר גלויה למשך 2.9 שניות (3000 - 100)
    }
}