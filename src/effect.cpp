#include "effect.h"


bool AddBrightnessEffect::Apply(Image *img)
{
    int h = img->height();
    int w = img->width();

    for(int i = 0; i < h; i++)
        for(int j = 0; j < w; j++)
        {
            PixelHSV hsv = img->at(i, j).RGB();
            hsv.V += (double)brightness_ / 100;
            if(hsv.V > 1.0) hsv.V = 1;
            img->at(i, j).setRGB(hsv.RGB());
        }
    return true;
}

AddBrightnessEffect::AddBrightnessEffect() : brightness_(0)
{
}
AddBrightnessEffect::AddBrightnessEffect(int brightness) : brightness_(brightness)
{
}
int AddBrightnessEffect::brightness()
{
    return brightness_;
}
void AddBrightnessEffect::setBrightness(int brightness)
{
    brightness_ = brightness;
}