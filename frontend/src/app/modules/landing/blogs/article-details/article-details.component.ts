import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../blogs.service';
import { SocketService } from '../socket.service';

@Component({
    selector: 'article-details',
    standalone: true,
    templateUrl: './article-details.component.html',
    imports: [NgIf, NgForOf, FormsModule, MatDialogModule],
})
export class ArticleDetailsComponent implements OnInit {
    private articleService = inject(ArticleService);
    private socketService = inject(SocketService);

    article: any;
    comments: any[] = [];

    newComment = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: { articleId: string }) {}

    ngOnInit(): void {
        // Connect socket if not already
        this.socketService.connect();
        this.socketService.joinArticle(this.data.articleId);

        // Fetch article
        this.articleService
            .getArticle(this.data.articleId)
            .subscribe((res) => (this.article = res.data));

        // Fetch comments
        this.articleService
            .getComments(this.data.articleId)
            .subscribe((res) => (this.comments = res.data));

        // Listen to real-time new comments
        this.socketService.commentAdded$.subscribe((comment) => {
            if (comment.article === this.data.articleId) {
                this.comments.push(comment);
            }
        });
    }

    sendComment() {
        if (!this.newComment.trim()) return;

        this.articleService
            .createComment(this.data.articleId, {
                content: this.newComment,
            })
            .subscribe(() => {
                this.newComment = '';
            });
    }
}
