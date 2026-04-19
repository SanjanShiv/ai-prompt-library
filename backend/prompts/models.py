import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Prompt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    tags = models.ManyToManyField(Tag, related_name='prompts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'content': self.content,
            'complexity': self.complexity,
            'tags': [tag.name for tag in self.tags.all()],
            'created_at': self.created_at.isoformat()
        }

    def __str__(self):
        return self.title
