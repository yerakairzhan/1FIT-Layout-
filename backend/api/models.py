from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Gym(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.URLField()

    def __str__(self):
        return self.name


class Booking(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.user} - {self.gym.name} - {self.date} {self.time}"
    
class Posts(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return f"{self.user} - {self.name} - {self.content}"

