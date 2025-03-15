#include <stdlib.h>

int main(void) {
    #ifdef _WIN32
        system("start http://localhost:1234");
    #elif __APPLE__
        system("open https://localhost:1234");
    #else
        system("xdg-open https://localhost:1234");
    #endif
    
    system("node \"<PATH_TO_JS.JS>\"");
    return 0;
}
